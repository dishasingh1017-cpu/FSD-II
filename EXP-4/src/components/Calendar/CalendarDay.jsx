import { useMemo } from "react";
import TimeSlot from "./TimeSlot";

function CalendarDay({
  day,
  dayIndex,
  timeSlots = [],
  posts = [],
  useMemoOptimization = false,
  useReactMemo = false,
  useCallbackOptimization = false,
  onEdit,
  onDrop,
  onInteractionStart,
}) {
  const safePosts = Array.isArray(posts)
    ? posts
    : [];

  const memoizedPosts = useMemo(() => {
    return safePosts.filter(
      (post) => post.date === day.date
    );
  }, [safePosts, day.date]);

  const normalPosts = safePosts.filter(
    (post) => post.date === day.date
  );

  const dayPosts = useMemoOptimization
    ? memoizedPosts
    : normalPosts;

  return (
    <div className="calendar-day">
      {timeSlots.map((time) => {
        const postsForSlot = dayPosts.filter(
          (post) => post.time === time
        );

        return (
          <TimeSlot
            key={`${day.date}-${time}`}
            dayIndex={dayIndex}
            time={time}
            posts={postsForSlot}
            useReactMemo={useReactMemo}
            useCallbackOptimization={
              useCallbackOptimization
            }
            onEdit={onEdit}
            onDrop={onDrop}
            onInteractionStart={
              onInteractionStart
            }
          />
        );
      })}
    </div>
  );
}

export default CalendarDay;