import { child, log, withTrace } from './trace';
awaitDemo();
async function awaitDemo() {
  const response = await withTrace(undefined, async root => {
    log(root, 'customer.registration.started');
    await Promise.resolve();
    log(child(root), 'customer.validation.passed');
    return 'Synthetic Customer validation completed';
  });
  console.log(JSON.stringify(response));
}
