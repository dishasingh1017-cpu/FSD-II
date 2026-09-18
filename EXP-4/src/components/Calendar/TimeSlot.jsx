import { useCallback } from "react";
import PostCard, { MemoPostCard } from "./PostCard";

function TimeSlot({
  dayIndex,
  time,
  posts = [],
  useReactMemo = false,
  useCallbackOptimization = false,
  onEdit,
  onDrop,
  onInteractionStart,
}) {
  const safePosts = Array.isArray(posts) ? posts : [];

  const memoizedDrop = useCallback(
    (event) => {
      event.preventDefault();

      event.currentTarget.classList.remove(
        "drag-over"
      );

      const postId =
        event.dataTransfer.getData("postId");

      if (postId && onDrop) {
        onDrop(
          postId,
          dayIndex,
          time
        );
      }
    },
    [onDrop, dayIndex, time]
  );

  const normalDrop = (event) => {
    event.preventDefault();

    event.currentTarget.classList.remove(
      "drag-over"
    );

    const postId =
      event.dataTransfer.getData("postId");

    if (postId && onDrop) {
      onDrop(
        postId,
        dayIndex,
        time
      );
    }
  };

  const handleDrop =
    useCallbackOptimization
      ? memoizedDrop
      : normalDrop;

  const handleDragOver = (event) => {
    event.preventDefault();

    event.currentTarget.classList.add(
      "drag-over"
    );
  };

  const handleDragLeave = (event) => {
    event.currentTarget.classList.remove(
      "drag-over"
    );
  };

  const Card = useReactMemo
    ? MemoPostCard
    : PostCard;

  return (
    <div
      className="time-slot"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-testid={`slot-${dayIndex}-${time}`}
    >
      {safePosts.map((post) => (
        <Card
          key={post.id}
          post={post}
          onEdit={onEdit}
          useCallbackOptimization={
            useCallbackOptimization
          }
          onInteractionStart={
            onInteractionStart
          }
        />
      ))}
    </div>
  );
}

export default TimeSlot;