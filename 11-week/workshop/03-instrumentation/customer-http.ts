import { child, traceparent } from './trace';
import type { Span } from './trace';
type Operation = 'create' | 'refresh';
type Outcome = 'success' | 'failure';
export class CustomerMetrics {
  private counts = new Map<string, number>();
  private bounds = [0.005, 0.05, 0.5, 5, Infinity];
  private buckets = this.bounds.map(() => 0);
  private sum = 0;
  observe(operation: Operation, outcome: Outcome, seconds: number): void {
    if (!['create', 'refresh'].includes(operation) || !['success', 'failure'].includes(outcome) || !Number.isFinite(seconds) || seconds < 0) throw new Error('Invalid metric observation');
    const key = `operation="${operation}",outcome="${outcome}"`;
    this.counts.set(key, (this.counts.get(key) ?? 0) + 1);
    this.bounds.forEach((bound, i) => { if (seconds <= bound) this.buckets[i]++; });
    this.sum += seconds;
  }
  prometheus(): string {
    return ['# TYPE customer_operations_total counter',
      ...Array.from(this.counts, ([labels, count]) => `customer_operations_total{${labels}} ${count}`),
      '# TYPE customer_operation_duration_seconds histogram',
      ...this.bounds.map((bound, i) => `customer_operation_duration_seconds_bucket{le="${bound === Infinity ? '+Inf' : bound}"} ${this.buckets[i]}`),
      `customer_operation_duration_seconds_sum ${this.sum}`,
      `customer_operation_duration_seconds_count ${this.buckets[this.buckets.length - 1]}`, ''].join('\n');
  }
}
export type Transport = (request: Request) => Promise<Response>;
export async function customerHttp(parent: Span, operation: Operation, transport: Transport, metrics: CustomerMetrics) {
  if (operation !== 'create' && operation !== 'refresh') throw new Error('Invalid Customer operation');
  const span = child(parent), started = performance.now();
  let outcome: Outcome = 'failure';
  try {
    const request = new Request('https://customer.invalid/api/clientes', {
      method: operation === 'create' ? 'POST' : 'GET', headers: { traceparent: traceparent(span) },
    });
    const response = await transport(request);
    if (!response.ok) throw new Error('Unsuccessful response');
    outcome = 'success';
    return { response, span };
  } catch {
    throw new Error('Customer HTTP operation failed');
  } finally {
    metrics.observe(operation, outcome, (performance.now() - started) / 1000);
  }
}
