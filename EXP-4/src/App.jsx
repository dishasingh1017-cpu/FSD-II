import {
  Profiler,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

import "./App.css";

/* =========================================================
   CALENDAR DATA
========================================================= */

const DAYS = [
  {
    date: "2026-09-07",
    short: "MON",
    number: 7,
  },
  {
    date: "2026-09-08",
    short: "TUE",
    number: 8,
  },
  {
    date: "2026-09-09",
    short: "WED",
    number: 9,
  },
  {
    date: "2026-09-10",
    short: "THU",
    number: 10,
    today: true,
  },
  {
    date: "2026-09-11",
    short: "FRI",
    number: 11,
  },
  {
    date: "2026-09-12",
    short: "SAT",
    number: 12,
  },
  {
    date: "2026-09-13",
    short: "SUN",
    number: 13,
  },
];

const TIMES = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

const INITIAL_POSTS = [
  {
    id: "1",
    title: "React Performance Tips",
    platform: "LinkedIn",
    date: "2026-09-07",
    time: "9:00 AM",
  },
  {
    id: "2",
    title: "Web Development Roadmap",
    platform: "LinkedIn",
    date: "2026-09-08",
    time: "10:00 AM",
  },
  {
    id: "3",
    title: "Full Stack Development",
    platform: "LinkedIn",
    date: "2026-09-09",
    time: "11:00 AM",
  },
  {
    id: "4",
    title: "JavaScript ES2026",
    platform: "Instagram",
    date: "2026-09-10",
    time: "11:00 AM",
  },
  {
    id: "5",
    title: "CSS Grid Masterclass",
    platform: "Instagram",
    date: "2026-09-10",
    time: "12:00 PM",
  },
  {
    id: "6",
    title: "Building Better UIs",
    platform: "Twitter",
    date: "2026-09-11",
    time: "2:00 PM",
  },
  {
    id: "7",
    title: "Modern Frontend Architecture",
    platform: "LinkedIn",
    date: "2026-09-12",
    time: "3:00 PM",
  },
];

/* =========================================================
   PERFORMANCE STORE
========================================================= */

let performanceState = {
  profilerCommits: 0,
  postCardRenders: 0,
  lastDragTime: 0,

  baselineRenders: null,
  optimizedRenders: null,

  baselineCommits: null,
  optimizedCommits: null,

  lastMode: null,
};

const performanceListeners = new Set();

let activeInteraction = false;
let activeMode = "baseline";

let interactionRenderCount = 0;
let interactionCommitCount = 0;
let interactionStartTime = 0;

function subscribePerformance(listener) {
  performanceListeners.add(listener);

  return () => {
    performanceListeners.delete(listener);
  };
}

function getPerformanceSnapshot() {
  return performanceState;
}

function notifyPerformance() {
  performanceListeners.forEach((listener) => {
    listener();
  });
}

/* ---------------------------------------------------------
   RESET
--------------------------------------------------------- */

function resetPerformance() {
  performanceState = {
    profilerCommits: 0,
    postCardRenders: 0,
    lastDragTime: 0,

    baselineRenders: null,
    optimizedRenders: null,

    baselineCommits: null,
    optimizedCommits: null,

    lastMode: null,
  };

  activeInteraction = false;
  activeMode = "baseline";

  interactionRenderCount = 0;
  interactionCommitCount = 0;
  interactionStartTime = 0;

  notifyPerformance();
}

/* ---------------------------------------------------------
   START ONE OPERATION
--------------------------------------------------------- */

function beginInteraction(mode) {
  activeInteraction = true;
  activeMode = mode;

  interactionRenderCount = 0;
  interactionCommitCount = 0;
  interactionStartTime = performance.now();

  performanceState = {
    ...performanceState,
    lastMode: mode,
    lastDragTime: 0,
  };

  notifyPerformance();
}

/* ---------------------------------------------------------
   POSTCARD RENDER
--------------------------------------------------------- */

function recordPostCardRender() {
  if (!activeInteraction) {
    return;
  }

  interactionRenderCount += 1;
}

/* ---------------------------------------------------------
   PROFILER COMMIT
--------------------------------------------------------- */

function recordProfilerCommit(
  actualDuration
) {
  if (!activeInteraction) {
    return;
  }

  interactionCommitCount += 1;

  performanceState = {
    ...performanceState,

    profilerCommits:
      performanceState.profilerCommits + 1,

    lastDragTime: Math.max(
      performanceState.lastDragTime,
      actualDuration || 0
    ),
  };

  notifyPerformance();
}

/* ---------------------------------------------------------
   FINISH ONE OPERATION
--------------------------------------------------------- */

function finishInteraction() {
  if (!activeInteraction) {
    return;
  }

  const elapsed =
    performance.now() -
    interactionStartTime;

  const renders =
    interactionRenderCount;

  const commits =
    interactionCommitCount;

  performanceState = {
    ...performanceState,

    postCardRenders:
      performanceState.postCardRenders +
      renders,

    lastDragTime: elapsed,

    baselineRenders:
      activeMode === "baseline"
        ? (performanceState.baselineRenders ??
            0) + renders
        : performanceState.baselineRenders,

    optimizedRenders:
      activeMode === "optimized"
        ? (performanceState.optimizedRenders ??
            0) + renders
        : performanceState.optimizedRenders,

    baselineCommits:
      activeMode === "baseline"
        ? (performanceState.baselineCommits ??
            0) + commits
        : performanceState.baselineCommits,

    optimizedCommits:
      activeMode === "optimized"
        ? (performanceState.optimizedCommits ??
            0) + commits
        : performanceState.optimizedCommits,
  };

  activeInteraction = false;

  interactionRenderCount = 0;
  interactionCommitCount = 0;
  interactionStartTime = 0;

  notifyPerformance();
}

/* =========================================================
   LIVE CLOCK
========================================================= */

function LiveClock({
  useMemoOptimization,
}) {
  const [now, setNow] = useState(
    () => new Date()
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  /* useMemo implementation */

  const memoizedClock = useMemo(() => {
    return new Intl.DateTimeFormat(
      "en-US",
      {
        weekday: "long",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
      }
    ).format(now);
  }, [now]);

  /* Non-optimized implementation */

  const normalClock =
    new Intl.DateTimeFormat(
      "en-US",
      {
        weekday: "long",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
      }
    ).format(now);

  const displayClock =
    useMemoOptimization
      ? memoizedClock
      : normalClock;

  return (
    <div className="live-clock">
      <span className="clock-dot" />
      <span>{displayClock}</span>
    </div>
  );
}

/* =========================================================
   HEADER
========================================================= */

function Header({
  useMemoOptimization,
}) {
  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand-logo">
          P
        </div>

        <div>
          <h1 className="brand-title">
            PostFlow
          </h1>

          <span className="brand-subtitle">
            Scheduling & Performance Lab
          </span>
        </div>
      </div>

      <LiveClock
        useMemoOptimization={
          useMemoOptimization
        }
      />
    </header>
  );
}

/* =========================================================
   POST CARD
========================================================= */

function PostCard({
  post,
  onEdit,
  onDragStart,
  useCallbackOptimization,
}) {
  /*
   * This counts REAL PostCard function
   * executions.
   */
  recordPostCardRender();

  /*
   * Hooks are ALWAYS called.
   */

  const memoizedEdit = useCallback(() => {
    onEdit(post);
  }, [onEdit, post]);

  const normalEdit = () => {
    onEdit(post);
  };

  const memoizedDragStart =
    useCallback(
      (event) => {
        event.dataTransfer.setData(
          "postId",
          post.id
        );

        event.dataTransfer.effectAllowed =
          "move";

        onDragStart();
      },
      [post.id, onDragStart]
    );

  const normalDragStart = (event) => {
    event.dataTransfer.setData(
      "postId",
      post.id
    );

    event.dataTransfer.effectAllowed =
      "move";

    onDragStart();
  };

  const editHandler =
    useCallbackOptimization
      ? memoizedEdit
      : normalEdit;

  const dragHandler =
    useCallbackOptimization
      ? memoizedDragStart
      : normalDragStart;

  return (
    <div
      className="post-card"
      draggable
      onClick={editHandler}
      onDragStart={dragHandler}
      data-testid={`post-${post.id}`}
    >
      <div className="card-top">
        <div className="platform">
          {post.platform === "LinkedIn"
            ? "in"
            : post.platform ===
                "Instagram"
              ? "◎"
              : "𝕏"}
        </div>

        <span className="status-badge">
          Scheduled
        </span>
      </div>

      <div className="post-title">
        {post.title}
      </div>

      <div className="post-info">
        {post.platform} • {post.time}
      </div>

      <div className="drag-text">
        ↕ Drag to reschedule
      </div>
    </div>
  );
}

/*
 * ACTUAL React.memo version.
 */
const MemoPostCard =
  memo(PostCard);

/* =========================================================
   CALENDAR
========================================================= */

function Calendar({
  posts,
  useReactMemo,
  useCallbackOptimization,
  useMemoOptimization,
  onEdit,
  onDrop,
  onDragStart,
}) {
  /*
   * ======================================================
   * useMemo: agenda filtering
   * ======================================================
   */

  const memoizedPostsByDay =
    useMemo(() => {
      const result = {};

      DAYS.forEach((day) => {
        result[day.date] =
          posts.filter(
            (post) =>
              post.date === day.date
          );
      });

      return result;
    }, [posts]);

  /*
   * ======================================================
   * NON-OPTIMIZED agenda filtering
   * ======================================================
   */

  const normalPostsByDay = {};

  DAYS.forEach((day) => {
    normalPostsByDay[day.date] =
      posts.filter(
        (post) =>
          post.date === day.date
      );
  });

  const postsByDay =
    useMemoOptimization
      ? memoizedPostsByDay
      : normalPostsByDay;

  /*
   * Choose actual PostCard implementation.
   */
  const Card = useReactMemo
    ? MemoPostCard
    : PostCard;

  return (
    <Profiler
      id="PostFlowCalendar"
      onRender={(
        id,
        phase,
        actualDuration
      ) => {
        recordProfilerCommit(
          actualDuration
        );
      }}
    >
      <>
        {/* =================================================
            CALENDAR HEADER
        ================================================= */}

        <div className="calendar-wrapper">
          <div className="calendar-header">
            <div className="time-header">
              TIME
            </div>

            {DAYS.map((day) => (
              <div
                key={day.date}
                className={`day-header ${
                  day.today
                    ? "today"
                    : ""
                }`}
              >
                <span>
                  {day.short}
                </span>

                <strong>
                  {day.number}
                </strong>
              </div>
            ))}
          </div>

          {/* =================================================
              CALENDAR BODY
          ================================================= */}

          <div className="calendar-body">
            {/* TIME COLUMN */}

            <div className="time-column">
              {TIMES.map((time) => (
                <div
                  className="time-label"
                  key={time}
                >
                  {time}
                </div>
              ))}
            </div>

            {/* DAYS */}

            <div className="calendar-grid">
              {DAYS.map((day) => (
                <div
                  className="calendar-day"
                  key={day.date}
                >
                  {TIMES.map((time) => {
                    const slotPosts =
                      (
                        postsByDay[
                          day.date
                        ] || []
                      ).filter(
                        (post) =>
                          post.time ===
                          time
                      );

                    return (
                      <div
                        className="time-slot"
                        key={`${day.date}-${time}`}
                        onDragOver={(
                          event
                        ) => {
                          event.preventDefault();

                          event.currentTarget.classList.add(
                            "drag-over"
                          );
                        }}
                        onDragLeave={(
                          event
                        ) => {
                          event.currentTarget.classList.remove(
                            "drag-over"
                          );
                        }}
                        onDrop={(event) => {
                          event.preventDefault();

                          event.currentTarget.classList.remove(
                            "drag-over"
                          );

                          const postId =
                            event.dataTransfer.getData(
                              "postId"
                            );

                          if (
                            !postId
                          ) {
                            return;
                          }

                          onDrop(
                            postId,
                            day.date,
                            time
                          );
                        }}
                      >
                        {slotPosts.map(
                          (post) => (
                            <Card
                              key={
                                post.id
                              }
                              post={
                                post
                              }
                              onEdit={
                                onEdit
                              }
                              onDragStart={
                                onDragStart
                              }
                              useCallbackOptimization={
                                useCallbackOptimization
                              }
                            />
                          )
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="calendar-help">
          💡 <strong>Click</strong>{" "}
          a post to edit it.
          <span>•</span>
          <strong>Drag</strong> a post to
          another time slot to reschedule it.
        </div>
      </>
    </Profiler>
  );
}

/* =========================================================
   PERFORMANCE PANEL
========================================================= */

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
  const metrics =
    useSyncExternalStore(
      subscribePerformance,
      getPerformanceSnapshot,
      getPerformanceSnapshot
    );

  return (
    <aside className="performance-panel">
      {/* HEADER */}

      <div className="performance-header">
        <div>
          <div className="experiment-label">
            EXPERIMENT 1.4.2
          </div>

          <h2>
            Performance Lab
          </h2>
        </div>

        <span
          className={`mode-badge ${
            optimized
              ? "optimized"
              : "baseline"
          }`}
        >
          {optimized
            ? "OPTIMIZED"
            : "BASELINE"}
        </span>
      </div>

      <p className="performance-description">
        Compare React rendering behaviour
        before and after optimization.
      </p>

      {/* MODE SWITCH */}

      <div className="mode-switch">
        <button
          className={
            !optimized
              ? "active"
              : ""
          }
          onClick={() =>
            setOptimized(false)
          }
        >
          Non-Optimized
        </button>

        <button
          className={
            optimized
              ? "active"
              : ""
          }
          onClick={() =>
            setOptimized(true)
          }
        >
          Optimized
        </button>
      </div>

      {/* OPTIMIZATIONS */}

      <div className="optimization-options">
        <label
          className={`optimization-option ${
            !optimized
              ? "disabled"
              : ""
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
              setUseReactMemo(
                event.target.checked
              )
            }
          />
        </label>

        <label
          className={`optimization-option ${
            !optimized
              ? "disabled"
              : ""
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
            checked={
              useCallbackOptimization
            }
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
            !optimized
              ? "disabled"
              : ""
          }`}
        >
          <div>
            <span className="optimization-name">
              useMemo
            </span>

            <span className="optimization-description">
              Cache agenda calculations
            </span>
          </div>

          <input
            type="checkbox"
            checked={
              useMemoOptimization
            }
            disabled={!optimized}
            onChange={(event) =>
              setUseMemoOptimization(
                event.target.checked
              )
            }
          />
        </label>
      </div>

      {/* =================================================
          INTERACTION METRICS
      ================================================= */}

      <div className="metrics-heading">
        <strong>
          Interaction Metrics
        </strong>

        <button
          className="reset-button"
          onClick={
            resetPerformance
          }
        >
          Reset
        </button>
      </div>

      <div className="metrics-grid">
        {/* PROFILER */}

        <div className="metric-box">
          <span className="metric-label">
            Profiler commits
          </span>

          <strong className="metric-value">
            {metrics.profilerCommits}
          </strong>

          <span className="metric-note">
            cumulative
          </span>
        </div>

        {/* POSTCARD */}

        <div className="metric-box">
          <span className="metric-label">
            PostCard renders
          </span>

          <strong className="metric-value">
            {metrics.postCardRenders}
          </strong>

          <span className="metric-note">
            cumulative
          </span>
        </div>

        {/* DRAG TIME */}

        <div className="metric-box full">
          <span className="metric-label">
            Last drag time
          </span>

          <strong className="metric-value">
            {metrics.lastDragTime.toFixed(
              2
            )}{" "}
            ms
          </strong>
        </div>
      </div>

      {/* =================================================
          COMPARISON
      ================================================= */}

      <div className="comparison">
        <h3>
          Render Comparison
        </h3>

        <div className="comparison-row">
          <span>
            Non-optimized renders
          </span>

          <strong>
            {metrics.baselineRenders ??
              "—"}
          </strong>
        </div>

        <div className="comparison-row">
          <span>
            Optimized renders
          </span>

          <strong>
            {metrics.optimizedRenders ??
              "—"}
          </strong>
        </div>

        <div className="comparison-row">
          <span>
            Baseline commits
          </span>

          <strong>
            {metrics.baselineCommits ??
              "—"}
          </strong>
        </div>

        <div className="comparison-row">
          <span>
            Optimized commits
          </span>

          <strong>
            {metrics.optimizedCommits ??
              "—"}
          </strong>
        </div>
      </div>

      {/* =================================================
          EXPLANATION
      ================================================= */}

      <div className="expected-result">
        <div className="expected-title">
          Experiment Observation
        </div>

        <p>
          <strong>React.memo:</strong>{" "}
          avoids rendering unchanged
          PostCards.
        </p>

        <p>
          <strong>useCallback:</strong>{" "}
          keeps function props stable.
        </p>

        <p>
          <strong>useMemo:</strong>{" "}
          caches derived agenda data.
        </p>

        <p>
          <strong>Profiler:</strong>{" "}
          measures actual React commit
          phases.
        </p>
      </div>
    </aside>
  );
}

/* =========================================================
   CREATE / EDIT MODAL
========================================================= */

function PostModal({
  post,
  onSave,
  onDelete,
  onClose,
}) {
  const [title, setTitle] =
    useState(post?.title || "");

  const [platform, setPlatform] =
    useState(
      post?.platform || "LinkedIn"
    );

  const [date, setDate] =
    useState(
      post?.date || "2026-09-07"
    );

  const [time, setTime] =
    useState(
      post?.time || "8:00 AM"
    );

  const submit = (event) => {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    onSave({
      id: post?.id,
      title: title.trim(),
      platform,
      date,
      time,
    });
  };

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="modal">
        <div className="modal-header">
          <div>
            <div className="experiment-label">
              POST MANAGEMENT
            </div>

            <h2>
              {post
                ? "Edit Post"
                : "Create Post"}
            </h2>
          </div>

          <button
            className="modal-close"
            type="button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form onSubmit={submit}>
          <div className="form-group">
            <label>
              Post Title
            </label>

            <input
              value={title}
              onChange={(event) =>
                setTitle(
                  event.target.value
                )
              }
              placeholder="Enter post title"
            />
          </div>

          <div className="form-group">
            <label>
              Platform
            </label>

            <select
              value={platform}
              onChange={(event) =>
                setPlatform(
                  event.target.value
                )
              }
            >
              <option>
                LinkedIn
              </option>

              <option>
                Instagram
              </option>

              <option>
                Twitter
              </option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                Date
              </label>

              <input
                type="date"
                value={date}
                onChange={(event) =>
                  setDate(
                    event.target.value
                  )
                }
              />
            </div>

            <div className="form-group">
              <label>
                Time
              </label>

              <select
                value={time}
                onChange={(event) =>
                  setTime(
                    event.target.value
                  )
                }
              >
                {TIMES.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-actions">
            {post && (
              <button
                type="button"
                className="danger-button"
                onClick={() =>
                  onDelete(post.id)
                }
              >
                Delete
              </button>
            )}

            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-button"
            >
              {post
                ? "Save Changes"
                : "Create Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN APP
========================================================= */

function App() {
  const [posts, setPosts] =
    useState(INITIAL_POSTS);

  const [optimized, setOptimized] =
    useState(false);

  const [useReactMemo, setUseReactMemo] =
    useState(false);

  const [
    useCallbackOptimization,
    setUseCallbackOptimization,
  ] = useState(false);

  const [
    useMemoOptimization,
    setUseMemoOptimization,
  ] = useState(false);

  const [modalOpen, setModalOpen] =
    useState(false);

  const [editingPost, setEditingPost] =
    useState(null);

  /*
   * Stable edit callback.
   */
  const handleEdit = useCallback(
    (post) => {
      setEditingPost(post);
      setModalOpen(true);
    },
    []
  );

  /*
   * Stable drag-start callback.
   *
   * NO React state update here.
   *
   * This prevents the drag-start event
   * itself from creating a fake extra
   * seven-card render.
   */
  const handleDragStart =
    useCallback(() => {
      const isFullyOptimized =
        optimized &&
        useReactMemo &&
        useCallbackOptimization;

      beginInteraction(
        isFullyOptimized
          ? "optimized"
          : "baseline"
      );
    }, [
      optimized,
      useReactMemo,
      useCallbackOptimization,
    ]);

  /*
   * Stable drop callback.
   */
  const handleDrop = useCallback(
    (
      postId,
      targetDate,
      targetTime
    ) => {
      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                date: targetDate,
                time: targetTime,
              }
            : post
        )
      );

      /*
       * Wait until React has completed
       * the state update and Profiler
       * has measured the render.
       */
      setTimeout(() => {
        finishInteraction();
      }, 100);
    },
    []
  );

  /*
   * CREATE
   */
  const openCreate = () => {
    setEditingPost(null);
    setModalOpen(true);
  };

  /*
   * CLOSE
   */
  const closeModal = () => {
    setModalOpen(false);
    setEditingPost(null);
  };

  /*
   * SAVE
   */
  const savePost = (postData) => {
    if (postData.id) {
      setPosts((current) =>
        current.map((post) =>
          post.id === postData.id
            ? postData
            : post
        )
      );
    } else {
      setPosts((current) => [
        ...current,
        {
          ...postData,
          id: String(Date.now()),
        },
      ]);
    }

    closeModal();
  };

  /*
   * DELETE
   */
  const deletePost = (id) => {
    setPosts((current) =>
      current.filter(
        (post) => post.id !== id
      )
    );

    closeModal();
  };

  return (
    <div className="app">
      {/* =================================================
          HEADER
      ================================================= */}

      <Header
        useMemoOptimization={
          optimized &&
          useMemoOptimization
        }
      />

      <main className="main-layout">
        {/* =================================================
            EXPERIMENT 1.4.1
        ================================================= */}

        <section className="calendar-section">
          <div className="section-heading">
            <div>
              <div className="experiment-label">
                EXPERIMENT 1.4.1
              </div>

              <h2>
                Content Calendar
              </h2>

              <p>
                Interactive temporal
                scheduling with drag-and-drop
                rescheduling.
              </p>
            </div>

            <button
              className="primary-button"
              onClick={openCreate}
            >
              + New Post
            </button>
          </div>

          {/* TOOLBAR */}

          <div className="calendar-toolbar">
            <div className="week-navigation">
              <button
                className="icon-button"
                aria-label="Previous week"
              >
                ‹
              </button>

              <button className="today-button">
                Today
              </button>

              <button
                className="icon-button"
                aria-label="Next week"
              >
                ›
              </button>

              <strong>
                Sep 7 – Sep 13, 2026
              </strong>
            </div>

            <div className="calendar-summary">
              <strong>
                {posts.length}
              </strong>{" "}
              posts
              <span>•</span>
              <strong>7</strong>{" "}
              days
            </div>
          </div>

          {/* CALENDAR */}

          <Calendar
            posts={posts}
            useReactMemo={
              optimized &&
              useReactMemo
            }
            useCallbackOptimization={
              optimized &&
              useCallbackOptimization
            }
            useMemoOptimization={
              optimized &&
              useMemoOptimization
            }
            onEdit={handleEdit}
            onDrop={handleDrop}
            onDragStart={
              handleDragStart
            }
          />
        </section>

        {/* =================================================
            EXPERIMENT 1.4.2
        ================================================= */}

        <PerformancePanel
          optimized={optimized}
          setOptimized={setOptimized}
          useReactMemo={useReactMemo}
          setUseReactMemo={
            setUseReactMemo
          }
          useCallbackOptimization={
            useCallbackOptimization
          }
          setUseCallbackOptimization={
            setUseCallbackOptimization
          }
          useMemoOptimization={
            useMemoOptimization
          }
          setUseMemoOptimization={
            setUseMemoOptimization
          }
        />
      </main>

      {/* MODAL */}

      {modalOpen && (
        <PostModal
          post={editingPost}
          onSave={savePost}
          onDelete={deletePost}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default App;