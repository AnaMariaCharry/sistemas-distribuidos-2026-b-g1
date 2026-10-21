const { test } = require('node:test');
const assert = require('node:assert/strict');
const { context, child, traceparent, withTrace, log } = require('./build/trace.js');
test('secure IDs, parentage and explicit context survive asynchronous continuations', async () => {
  const root = context(), span = child(root);
  await Promise.resolve();
  assert.match(root.trace_id, /^[0-9a-f]{32}$/);
  assert.match(root.span_id, /^[0-9a-f]{16}$/);
  assert.notEqual(root.trace_id, '0'.repeat(32));
  assert.notEqual(root.span_id, '0'.repeat(16));
  assert.equal(span.trace_id, root.trace_id);
  assert.equal(span.parent_id, root.span_id);
  assert.notEqual(span.span_id, root.span_id);
  assert.notEqual(context().trace_id, root.trace_id);
});
test('filter extracts valid v00 context, returns header, and replaces malformed input', async () => {
  const incoming = traceparent(context());
  const response = await withTrace(incoming, async span => span);
  assert.equal(response.value.trace_id, incoming.split('-')[1]);
  assert.equal(response.value.parent_id, incoming.split('-')[2]);
  assert.equal(response.headers.traceparent, traceparent(response.value));
  for (const invalid of ['secret', `00-${'0'.repeat(32)}-${'1'.repeat(16)}-01`, incoming + '-extra']) {
    assert.equal(context(invalid).parent_id, undefined);
  }
});
test('CP2 JSON fields are allowlisted; customer data and raw errors cannot leak', () => {
  const span = { ...context(), email: 'private@example.invalid', password: 'PRIVATE_SENTINEL' };
  const lines = [];
  log(span, 'customer.list_refresh.failed', line => lines.push(line));
  const record = JSON.parse(lines[0]);
  const keys = 'timestamp level service version environment trace_id span_id correlation_id event message duration_ms module operation data_mode outcome component list_state error_code'.split(' ');
  assert.deepEqual(Object.keys(record).sort(), keys.sort());
  assert.equal(record.error_code, 'mock_refresh_failed');
  assert.equal(record.level, 'ERROR');
  assert.equal(record.trace_id, span.trace_id);
  assert.ok(record.duration_ms >= 0);
  assert.match(record.timestamp, /^\d{4}-\d{2}-\d{2}T.*Z$/);
  assert.ok(!lines[0].includes('PRIVATE_SENTINEL') && !lines[0].includes('private@example.invalid'));
  assert.throws(() => log(span, 'private@example.invalid'), /Invalid log context/);
});
