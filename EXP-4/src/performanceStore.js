let metrics = {
  calendarRenders: 0,
  postCardRenders: 0,
  lastDragTime: 0,
  baselineRenders: null,
  optimizedRenders: null,
};

let isTrackingInteraction = false;
let interactionMode = "baseline";
let interactionStart = 0;

const listeners = new Set();

function notify() {
  listeners.forEach((listener) => listener());
}

export function subscribePerformance(listener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function getPerformanceMetrics() {
  return metrics;
}

export function resetPerformanceMetrics() {
  metrics = {
    calendarRenders: 0,
    postCardRenders: 0,
    lastDragTime: 0,
    baselineRenders: null,
    optimizedRenders: null,
  };

  isTrackingInteraction = false;
  interactionStart = 0;

  notify();
}

export function beginInteraction(mode) {
  isTrackingInteraction = true;
  interactionMode = mode;
  interactionStart = performance.now();

  metrics = {
    ...metrics,
    calendarRenders: 0,
    postCardRenders: 0,
    lastDragTime: 0,
  };

  notify();
}

export function recordProfilerRender(actualDuration = 0) {
  if (!isTrackingInteraction) {
    return;
  }

  metrics = {
    ...metrics,
    calendarRenders:
      metrics.calendarRenders + 1,
    lastDragTime:
      Math.max(
        metrics.lastDragTime,
        actualDuration
      ),
  };
}

export function recordPostCardRender() {
  if (!isTrackingInteraction) {
    return;
  }

  metrics = {
    ...metrics,
    postCardRenders:
      metrics.postCardRenders + 1,
  };
}

export function finishInteraction() {
  if (!isTrackingInteraction) {
    return;
  }

  const elapsed =
    performance.now() - interactionStart;

  metrics = {
    ...metrics,
    lastDragTime: elapsed,
  };

  if (interactionMode === "baseline") {
    metrics = {
      ...metrics,
      baselineRenders:
        metrics.postCardRenders,
    };
  }

  if (interactionMode === "optimized") {
    metrics = {
      ...metrics,
      optimizedRenders:
        metrics.postCardRenders,
    };
  }

  isTrackingInteraction = false;

  notify();
}

export function getInteractionMode() {
  return interactionMode;
}