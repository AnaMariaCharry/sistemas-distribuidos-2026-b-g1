const { test } = require('node:test');
const assert = require('node:assert/strict');
const { context, child, traceparent, withTrace, log } = require('./build/trace.js');
const { customerHttp, CustomerMetrics } = require('./build/customer-http.js');
test('incoming trace reaches outgoing HTTP with a new CLIENT span and isolated concurrent contexts', async () => {
  await Promise.all([context(), context()].map(async incoming => {
    const response = await withTrace(traceparent(incoming), async root => {
      const saveHandler = child(root), create = child(saveHandler);
      let sentHeader;
      const { span } = await customerHttp(create, 'create', async request => {
        await Promise.resolve();
        assert.ok(request instanceof Request);
        assert.equal(request.method, 'POST');
        assert.equal(new URL(request.url).pathname, '/api/clientes');
        assert.equal(await request.text(), '');
        const header = request.headers.get('traceparent');
        sentHeader = header;
        assert.match(header, /^00-[0-9a-f]{32}-[0-9a-f]{16}-01$/);
        assert.equal(header.split('-')[1], incoming.trace_id);
        assert.notEqual(header.split('-')[2], create.span_id);
        return new Response(null, { status: 201 });
      }, new CustomerMetrics());
      assert.equal(span.parent_id, create.span_id);
      assert.equal(sentHeader, traceparent(span));
      return span;
    });
    assert.equal(response.value.trace_id, incoming.trace_id);
  }));
});
test('transport rejection and HTTP failure are sanitized and counted exactly once', async () => {
  const metrics = new CustomerMetrics(), root = context(), refresh = child(root), lines = [];
  await customerHttp(root, 'create', async () => new Response(null, { status: 201 }), metrics);
  for (const transport of [async () => { throw new Error('PRIVATE_SENTINEL'); }, async () => new Response(null, { status: 503 })]) {
    let method;
    await assert.rejects(customerHttp(refresh, 'refresh', request => { method = request.method; return transport(); }, metrics), { message: 'Customer HTTP operation failed' });
    assert.equal(method, 'GET');
  }
  log(refresh, 'customer.list_refresh.failed', line => lines.push(line));
  log(root, 'customer.journey.partially_failed', line => lines.push(line));
  assert.ok(lines.every(line => !line.includes('PRIVATE_SENTINEL')));
  assert.ok(lines.map(JSON.parse).every(record => record.trace_id === root.trace_id));
  assert.match(metrics.prometheus(), /customer_operations_total\{operation="create",outcome="success"\} 1/);
  assert.match(metrics.prometheus(), /customer_operations_total\{operation="refresh",outcome="failure"\} 2/);
  assert.match(metrics.prometheus(), /customer_operation_duration_seconds_count 3\n/);
});
test('histogram boundaries are cumulative, seconds-based, finite and include failures', () => {
  const metrics = new CustomerMetrics();
  metrics.observe('create', 'success', 0.005);
  metrics.observe('refresh', 'failure', 0.05);
  const text = metrics.prometheus();
  for (const [bound, count] of [['0.005', 1], ['0.05', 2], ['0.5', 2], ['5', 2], ['+Inf', 2]]) {
    assert.ok(text.includes(`customer_operation_duration_seconds_bucket{le="${bound}"} ${count}\n`));
  }
  assert.ok(text.includes('customer_operation_duration_seconds_sum 0.055\n'));
  for (const invalid of [-1, Infinity, NaN]) assert.throws(() => metrics.observe('create', 'success', invalid));
  assert.throws(() => metrics.observe('private@example.invalid', 'success', 1));
});
