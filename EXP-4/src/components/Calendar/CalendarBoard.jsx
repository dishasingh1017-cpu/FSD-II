import { Profiler, useCallback, useState } from "react";

import CalendarDay from "./CalendarDay";

import { INITIAL_POSTS } from "../../data/posts";
import { DAYS, TIME_SLOTS } from "../../utils/dateUtils";

import {
  beginInteraction,
  finishInteraction,
} from "../../performanceStore";

function CalendarBoard({
  useReactMemo = false,
  useCallbackOptimization = false,
  useMemoOptimization = false,
  onEdit,
}) {
  const [posts, setPosts] = useState(INITIAL_POSTS);

  const startInteraction = useCallback(() => {
    const mode =
      useReactMemo && useCallbackOptimization
        ? "optimized"
        : "baseline";

    beginInteraction(mode);
  }, [useReactMemo, useCallbackOptimization]);

  const optimizedDrop = useCallback(
    (postId, dayIndex, time) => {
      const targetDay = DAYS[dayIndex];

      if (!targetDay) {
        return;
      }

      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                date: targetDay.date,
                time,
              }
            : post
        )
      );

      setTimeout(() => {
        finishInteraction();
      }, 50);
    },
    []
  );

  const normalDrop = (postId, dayIndex, time) => {
    const targetDay = DAYS[dayIndex];

    if (!targetDay) {
      return;
    }

    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              date: targetDay.date,
              time,
            }
          : post
      )
    );

    setTimeout(() => {
      finishInteraction();
    }, 50);
  };

  const handleDrop = useCallbackOptimization
    ? optimizedDrop
    : normalDrop;

  const handleProfiler = (
    id,
    phase,
    actualDuration
  ) => {
    // Performance recording is handled by
    // performanceStore.
    // NEVER call setState here.
    return {
      id,
      phase,
      actualDuration,
    };
  };

  return (
    <Profiler
      id="PostFlowCalendar"
      onRender={handleProfiler}
    >
      <>
        <div className="calendar-wrapper">
          <div className="calendar-header">
            <div className="time-header">
              TIME
            </div>

            {DAYS.map((day) => (
              <div
                key={day.date}
                className={`day-header ${
                  day.today ? "today" : ""
                }`}
              >
                <span>{day.short}</span>

                <strong>{day.number}</strong>
              </div>
            ))}
          </div>

          <div className="calendar-body">
            <div className="time-column">
              {TIME_SLOTS.map((time) => (
                <div
                  className="time-label"
                  key={time}
                >
                  {time}
                </div>
              ))}
            </div>

            <div className="calendar-grid">
              {DAYS.map((day, dayIndex) => (
                <CalendarDay
                  key={day.date}
                  day={day}
                  dayIndex={dayIndex}
                  timeSlots={TIME_SLOTS}
                  posts={posts}
                  useMemoOptimization={
                    useMemoOptimization
                  }
                  useReactMemo={useReactMemo}
                  useCallbackOptimization={
                    useCallbackOptimization
                  }
                  onEdit={onEdit}
                  onDrop={handleDrop}
                  onInteractionStart={
                    startInteraction
                  }
                />
              ))}
            </div>
          </div>
        </div>

        <div className="calendar-help">
          💡 <strong>Click</strong> a post to
          edit it.
          <span>•</span>
          <strong>Drag</strong> a post to another
          time slot to reschedule it.
        </div>
      </>
    </Profiler>
  );
}

export default CalendarBoard;