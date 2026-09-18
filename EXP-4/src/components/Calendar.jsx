import {
  memo,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";

function Calendar({ posts, onMovePost }) {
  const [draggedPostId, setDraggedPostId] =
    useState(null);

  // =========================
  // RENDER COUNTER
  // =========================
  const renderCount = useRef(0);

  renderCount.current += 1;

  // =========================
  // CALENDAR DAYS
  // =========================
  const days = [
    "MON",
    "TUE",
    "WED",
    "THU",
    "FRI",
    "SAT",
    "SUN",
  ];

  const firstDay = 1;
  const totalDays = 30;

  // =========================
  // MEMOIZED CALENDAR CELLS
  // =========================
  const calendarCells = useMemo(() => {
    const cells = [];

    for (let i = 0; i < firstDay; i++) {
      cells.push(null);
    }

    for (let day = 1; day <= totalDays; day++) {
      cells.push(day);
    }

    return cells;
  }, []);

  // =========================
  // GROUP POSTS BY DATE
  // =========================
  const postsByDate = useMemo(() => {
    const groupedPosts = {};

    posts.forEach((post) => {
      if (!groupedPosts[post.date]) {
        groupedPosts[post.date] = [];
      }

      groupedPosts[post.date].push(post);
    });

    return groupedPosts;
  }, [posts]);

  // =========================
  // DRAG START
  // =========================
  const handleDragStart = useCallback(
    (event, postId) => {
      setDraggedPostId(postId);

      event.dataTransfer.setData(
        "text/plain",
        String(postId)
      );

      event.dataTransfer.effectAllowed = "move";
    },
    []
  );

  // =========================
  // DRAG OVER
  // =========================
  const handleDragOver = useCallback((event) => {
    event.preventDefault();

    event.dataTransfer.dropEffect = "move";
  }, []);

  // =========================
  // DROP
  // =========================
  const handleDrop = useCallback(
    (event, newDate) => {
      event.preventDefault();

      const postId = Number(
        event.dataTransfer.getData("text/plain")
      );

      if (!postId || !newDate) {
        return;
      }

      onMovePost(postId, newDate);

      setDraggedPostId(null);
    },
    [onMovePost]
  );

  // =========================
  // DRAG END
  // =========================
  const handleDragEnd = useCallback(() => {
    setDraggedPostId(null);
  }, []);

  return (
    <div className="calendar">

      {/* RENDER COUNTER */}
      <div className="render-counter">
        Calendar renders: {renderCount.current}
      </div>

      {/* CALENDAR HEADER */}
      <div className="calendar-header">

        <button>
          ‹
        </button>

        <h2>
          September 2026
        </h2>

        <button>
          ›
        </button>

      </div>

      {/* WEEKDAYS */}
      <div className="weekdays">

        {days.map((day) => (
          <div
            key={day}
            className="weekday"
          >
            {day}
          </div>
        ))}

      </div>

      {/* CALENDAR GRID */}
      <div className="calendar-grid">

        {calendarCells.map((day, index) => {

          const dayPosts =
            postsByDate[day] || [];

          return (
            <div
              key={
                day !== null
                  ? day
                  : `empty-${index}`
              }
              className={`calendar-day ${
                draggedPostId
                  ? "drop-zone-active"
                  : ""
              }`}
              onDragOver={
                day
                  ? handleDragOver
                  : undefined
              }
              onDrop={
                day
                  ? (event) =>
                      handleDrop(
                        event,
                        day
                      )
                  : undefined
              }
            >

              {day && (
                <>

                  {/* DATE */}
                  <span className="day-number">
                    {day}
                  </span>

                  {/* POSTS */}
                  <div className="posts">

                    {dayPosts.map((post) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        onDragStart={
                          handleDragStart
                        }
                        onDragEnd={
                          handleDragEnd
                        }
                      />
                    ))}

                  </div>

                </>
              )}

            </div>
          );
        })}

      </div>

    </div>
  );
}


// =====================================
// MEMOIZED POST CARD
// =====================================

const PostCard = memo(function PostCard({
  post,
  onDragStart,
  onDragEnd,
}) {

  return (
    <div
      className={`post-card ${post.type.toLowerCase()}`}
      draggable
      onDragStart={(event) =>
        onDragStart(
          event,
          post.id
        )
      }
      onDragEnd={onDragEnd}
    >

      <strong>
        {post.title}
      </strong>

      <small>
        {post.type}

        {post.time &&
          ` • ${post.time}`}
      </small>

    </div>
  );
});


// =====================================
// EXPORT MEMOIZED CALENDAR
// =====================================

export default memo(Calendar);