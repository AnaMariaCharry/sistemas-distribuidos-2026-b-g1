export type Span = Readonly<{ trace_id: string; span_id: string; parent_id?: string; flags: string; correlation_id: string; started: number }>;
const valid = (value: string, size: number) => new RegExp(`^[0-9a-f]{${size}}$`).test(value) && !/^0+$/.test(value);
function id(bytes: number): string {
  const value = Array.from(crypto.getRandomValues(new Uint8Array(bytes)), n => n.toString(16).padStart(2, '0')).join('');
  return /^0+$/.test(value) ? id(bytes) : value;
}
export function context(incoming?: string): Span {
  const parts = incoming?.match(/^00-([0-9a-f]{32})-([0-9a-f]{16})-([0-9a-f]{2})$/);
  const accepted = parts && valid(parts[1], 32) && valid(parts[2], 16);
  return Object.freeze({ trace_id: accepted ? parts[1] : id(16), span_id: id(8),
    parent_id: accepted ? parts[2] : undefined, flags: accepted ? parts[3] : '01',
    correlation_id: id(16), started: performance.now() });
}
export function child(parent: Span): Span {
  traceparent(parent);
  return Object.freeze({ ...parent, span_id: id(8), parent_id: parent.span_id, started: performance.now() });
}
export function traceparent(span: Span): string {
  if (!valid(span.trace_id, 32) || !valid(span.span_id, 16) || !/^[0-9a-f]{2}$/.test(span.flags)) throw new Error('Invalid trace context');
  return `00-${span.trace_id}-${span.span_id}-${span.flags}`;
}
export async function withTrace<T>(incoming: string | undefined, next: (span: Span) => Promise<T>) {
  const span = context(incoming);
  return { headers: { traceparent: traceparent(span) }, value: await next(span) };
}
type EventSpec = readonly [string, string, string, string, string, string, string?];
const events = {
  'customer.registration.started': ['INFO', 'Customer registration started', 'register_and_refresh', 'started', 'ClienteForm', 'not_refreshed'],
  'customer.validation.passed': ['DEBUG', 'Customer form validation passed', 'validate', 'success', 'ClienteForm', 'not_refreshed'],
  'customer.mock_save.completed': ['INFO', 'Customer saved in MOCK storage', 'create', 'success', 'mockClientes', 'not_refreshed'],
  'customer.registration.saved': ['INFO', 'Customer save confirmed before list refresh', 'create', 'success', 'Clientes', 'not_refreshed'],
  'customer.list_refresh.started': ['INFO', 'Customer list refresh started', 'refresh', 'started', 'clienteService', 'refreshing'],
  'customer.list_refresh.failed': ['ERROR', 'Customer list refresh failed', 'refresh', 'failure', 'clienteService', 'stale', 'mock_refresh_failed'],
  'customer.journey.partially_failed': ['ERROR', 'Customer saved but list refresh failed', 'register_and_refresh', 'partial_failure', 'Clientes', 'stale', 'refresh_failed_after_save'],
} as const satisfies Record<string, EventSpec>;
export type Event = keyof typeof events;
export function log(span: Span, event: Event, sink: (line: string) => void = console.log): void {
  traceparent(span);
  if (!Object.hasOwn(events, event) || !valid(span.correlation_id, 32)) throw new Error('Invalid log context');
  const [level, message, operation, outcome, component, list_state, error_code] = events[event] as EventSpec;
  const duration_ms = Math.max(0, performance.now() - span.started);
  if (!Number.isFinite(duration_ms)) throw new Error('Invalid duration');
  sink(JSON.stringify({ timestamp: new Date().toISOString(), level, service: 'bysellens-customer-portal',
    version: 'cp3-local', environment: 'test', trace_id: span.trace_id, span_id: span.span_id,
    correlation_id: span.correlation_id, event, message, duration_ms, module: 'customer', operation,
    data_mode: 'mock', outcome, component, list_state, ...(error_code ? { error_code } : {}) }));
}
