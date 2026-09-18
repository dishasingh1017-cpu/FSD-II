import {
  memo,
  useCallback,
} from "react";

import {
  recordPostCardRender,
} from "../../performanceStore";

function PostCard({
  post,
  onEdit,
  useCallbackOptimization,
  onInteractionStart,
}) {
  recordPostCardRender();

  const memoizedEdit = useCallback(() => {
    onEdit(post);
  }, [onEdit, post]);

  const normalEdit = () => {
    onEdit(post);
  };

  const handleEdit =
    useCallbackOptimization
      ? memoizedEdit
      : normalEdit;

  const memoizedDragStart =
    useCallback(
      (event) => {
        event.dataTransfer.setData(
          "postId",
          post.id
        );

        event.dataTransfer.effectAllowed =
          "move";

        onInteractionStart?.(event);
      },
      [
        post.id,
        onInteractionStart,
      ]
    );

  const normalDragStart = (event) => {
    event.dataTransfer.setData(
      "postId",
      post.id
    );

    event.dataTransfer.effectAllowed =
      "move";

    onInteractionStart?.(event);
  };

  const handleDragStart =
    useCallbackOptimization
      ? memoizedDragStart
      : normalDragStart;

  return (
    <div
      className="post-card"
      draggable="true"
      onClick={handleEdit}
      onDragStart={handleDragStart}
      data-testid={`post-${post.id}`}
    >
      <div className="card-top">
        <div className="platform">
          {post.platform === "LinkedIn"
            ? "in"
            : post.platform === "Instagram"
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

export const MemoPostCard =
  memo(PostCard);

export default PostCard;