import { useMemo } from "react";

export default function Agenda({
  posts,
  platformFilter,
  setPlatformFilter,
  memoEnabled,
}) {
  const memoizedPosts = useMemo(() => {
    return posts.filter(
      (post) =>
        platformFilter === "All" ||
        post.platform === platformFilter
    );
  }, [posts, platformFilter]);

  const normalPosts = posts.filter(
    (post) =>
      platformFilter === "All" ||
      post.platform === platformFilter
  );

  const filteredPosts = memoEnabled
    ? memoizedPosts
    : normalPosts;

  return (
    <section className="agenda-section">

      <div className="section-heading">

        <div>
          <h2>Agenda</h2>

          <p>
            Upcoming scheduled posts
          </p>
        </div>

        <select
          value={platformFilter}
          onChange={(event) =>
            setPlatformFilter(event.target.value)
          }
        >
          <option value="All">
            All Platforms
          </option>

          <option value="Instagram">
            Instagram
          </option>

          <option value="LinkedIn">
            LinkedIn
          </option>

          <option value="Facebook">
            Facebook
          </option>
        </select>

      </div>

      <div className="agenda-list">

        {filteredPosts.length === 0 ? (
          <p className="empty-profiler">
            No posts found.
          </p>
        ) : (
          filteredPosts.map((post) => (
            <div
              className="agenda-item"
              key={post.id}
            >

              <div>
                <strong>
                  {post.title}
                </strong>

                <span>
                  {post.platform}
                </span>
              </div>

              <div>
                <span>
                  {post.date}
                </span>

                <span>
                  {post.time}
                </span>
              </div>

            </div>
          ))
        )}

      </div>

    </section>
  );
}