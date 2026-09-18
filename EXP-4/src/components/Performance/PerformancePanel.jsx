import { useState } from "react";

function PerformancePanel({
  optimized,
  setOptimized,
  useReactMemo,
  setUseReactMemo,
  useCallbackOptimization,
  setUseCallbackOptimization,
  useMemoOptimization,
  setUseMemoOptimization,
}) {
  const [metrics, setMetrics] = useState({
    calendar: 0,
    cards: 0,
    dragTime: 0,
  });

  const [comparison, setComparison] = useState({
    baseline: null,
    optimized: null,
  });

  const resetMetrics = () => {
    setMetrics({
      calendar: 0,
      cards: 0,
      dragTime: 0,
    });

    setComparison({
      baseline: null,
      optimized: null,
    });
  };

  const modeLabel = optimized
    ? "OPTIMIZED"
    : "BASELINE";

  return (
    <aside className="performance-panel">
      <div className="performance-header">
        <div>
          <div className="experiment-label">
            EXPERIMENT 1.4.2
          </div>

          <h2>Performance Lab</h2>
        </div>

        <span
          className={`mode-badge ${
            optimized ? "optimized" : "baseline"
          }`}
        >
          {modeLabel}
        </span>
      </div>

      <p className="performance-description">
        Compare React rendering behaviour by enabling
        optimization techniques one-by-one.
      </p>

      <div className="mode-switch">
        <button
          className={!optimized ? "active" : ""}
          onClick={() => setOptimized(false)}
        >
          Non-Optimized
        </button>

        <button
          className={optimized ? "active" : ""}
          onClick={() => setOptimized(true)}
        >
          Optimized
        </button>
      </div>

      <div className="optimization-options">
        <label
          className={`optimization-option ${
            !optimized ? "disabled" : ""
          }`}
        >
          <div>
            <span className="optimization-name">
              React.memo
            </span>

            <span className="optimization-description">
              Skip unchanged PostCards
            </span>
          </div>

          <input
            type="checkbox"
            checked={useReactMemo}
            disabled={!optimized}
            onChange={(event) =>
              setUseReactMemo(event.target.checked)
            }
          />
        </label>

        <label
          className={`optimization-option ${
            !optimized ? "disabled" : ""
          }`}
        >
          <div>
            <span className="optimization-name">
              useCallback
            </span>

            <span className="optimization-description">
              Stabilize event handlers
            </span>
          </div>

          <input
            type="checkbox"
            checked={useCallbackOptimization}
            disabled={!optimized}
            onChange={(event) =>
              setUseCallbackOptimization(
                event.target.checked
              )
            }
          />
        </label>

        <label
          className={`optimization-option ${
            !optimized ? "disabled" : ""
          }`}
        >
          <div>
            <span className="optimization-name">
              useMemo
            </span>

            <span className="optimization-description">
              Memoize derived calculations
            </span>
          </div>

          <input
            type="checkbox"
            checked={useMemoOptimization}
            disabled={!optimized}
            onChange={(event) =>
              setUseMemoOptimization(
                event.target.checked
              )
            }
          />
        </label>
      </div>

      <div className="metrics-heading">
        <strong>Interaction Metrics</strong>

        <button
          className="reset-button"
          onClick={resetMetrics}
        >
          Reset
        </button>
      </div>

      <div className="metrics-grid">
        <div className="metric-box">
          <span className="metric-label">
            Calendar renders
          </span>

          <strong className="metric-value">
            {metrics.calendar}
          </strong>
        </div>

        <div className="metric-box">
          <span className="metric-label">
            PostCard renders
          </span>

          <strong className="metric-value">
            {metrics.cards}
          </strong>
        </div>

        <div className="metric-box full">
          <span className="metric-label">
            Last drag time
          </span>

          <strong className="metric-value">
            {metrics.dragTime.toFixed(2)} ms
          </strong>
        </div>
      </div>

      <div className="comparison">
        <h3>Render Comparison</h3>

        <div className="comparison-row">
          <span>Non-optimized drag</span>
          <strong>
            {comparison.baseline ?? "—"}
          </strong>
        </div>

        <div className="comparison-row">
          <span>Fully optimized drag</span>
          <strong>
            {comparison.optimized ?? "—"}
          </strong>
        </div>
      </div>

      <div className="expected-result">
        <div className="expected-title">
          Expected Result
        </div>

        <p>
          Non-optimized → <strong>7</strong>
        </p>

        <p>
          React.memo → <strong>7</strong>
        </p>

        <p>
          memo + useCallback → <strong>1</strong>
        </p>

        <p>
          All optimizations → <strong>1</strong>
        </p>
      </div>
    </aside>
  );
}

export default PerformancePanel;