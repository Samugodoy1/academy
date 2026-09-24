import { academyApiFetch } from '../../api/client';
import { CURRENT_PRODUCT } from '../../config/product';

export type AnalyticsEventName =
  | 'paywall_view'
  | 'student_cta_click'
  | 'checkout_started'
  | 'checkout_redirect'
  | 'box_mode_open'
  | 'game_session_start'
  | 'first_patient_created';

type QueuedEvent = {
  event_name: AnalyticsEventName;
  properties?: Record<string, unknown>;
};

const queue: QueuedEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let flushing = false;

async function flushQueue() {
  if (flushing || queue.length === 0) return;
  flushing = true;
  const batch = queue.splice(0, 25);
  try {
    await academyApiFetch('/api/analytics/events', {
      method: 'POST',
      body: JSON.stringify({ product: CURRENT_PRODUCT, events: batch }),
    });
  } catch {
    queue.unshift(...batch);
  } finally {
    flushing = false;
    if (queue.length > 0) scheduleFlush();
  }
}

function scheduleFlush() {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    void flushQueue();
  }, 1200);
}

export function trackProductEvent(
  eventName: AnalyticsEventName,
  properties: Record<string, unknown> = {},
) {
  queue.push({ event_name: eventName, properties });
  scheduleFlush();
}

export function trackPaywallView(surface: string, extra: Record<string, unknown> = {}) {
  trackProductEvent('paywall_view', { surface, ...extra });
}

export function trackStudentCta(source: string, extra: Record<string, unknown> = {}) {
  trackProductEvent('student_cta_click', { source, ...extra });
}
