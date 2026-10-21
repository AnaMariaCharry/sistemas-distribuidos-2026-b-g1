import { child, log, withTrace } from './trace';
import { customerHttp, CustomerMetrics } from './customer-http';
const metrics = new CustomerMetrics();
void withTrace(undefined, async root => {
  log(root, 'customer.registration.started');
  const save = child(root);
  await customerHttp(child(save), 'create', async () => new Response(null, { status: 201 }), metrics);
  log(save, 'customer.registration.saved');
  const refresh = child(root);
  log(refresh, 'customer.list_refresh.started');
  try {
    await customerHttp(refresh, 'refresh', async () => { throw new Error('Synthetic refresh failure'); }, metrics);
  } catch {
    log(refresh, 'customer.list_refresh.failed');
    log(root, 'customer.journey.partially_failed');
  }
  console.log(metrics.prometheus());
}).catch(() => { console.error('Customer demonstration failed'); });
