import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Analytics({ posts }) {
  const [selectedPlatform, setSelectedPlatform] =
    useState("All");

  const [selectedDate, setSelectedDate] =
    useState(null);

  // Filter posts according to selected platform
  const filteredPosts = useMemo(() => {
    if (selectedPlatform === "All") {
      return posts;
    }

    return posts.filter(
      (post) => post.type === selectedPlatform
    );
  }, [posts, selectedPlatform]);

  // Create date-wise graph data
  const data = useMemo(() => {
    const result = [];

    for (let day = 1; day <= 30; day++) {
      const count = filteredPosts.filter(
        (post) => post.date === day
      ).length;

      result.push({
        date: day,
        posts: count,
      });
    }

    return result;
  }, [filteredPosts]);

  // Posts for selected date
  const selectedDatePosts = useMemo(() => {
    if (!selectedDate) {
      return [];
    }

    return filteredPosts.filter(
      (post) => post.date === selectedDate
    );
  }, [filteredPosts, selectedDate]);

  const handleBarClick = (data) => {
    if (data && data.activeLabel) {
      setSelectedDate(
        Number(data.activeLabel)
      );
    }
  };

  const handlePlatformChange = (platform) => {
    setSelectedPlatform(platform);
    setSelectedDate(null);
  };

  return (
    <div className="analytics">

      {/* HEADER */}
      <div className="analytics-header">

        <div>
          <p className="small-heading">
            ANALYTICS
          </p>

          <h2>
            Post Schedule Overview
          </h2>

          <p>
            Interactive visualization of your
            scheduled posts
          </p>
        </div>

        <div className="total-posts">
          <span>
            Total Posts
          </span>

          <strong>
            {filteredPosts.length}
          </strong>
        </div>

      </div>


      {/* PLATFORM FILTERS */}
      <div className="analytics-controls">

        <span>
          Filter by platform:
        </span>

        <button
          className={
            selectedPlatform === "All"
              ? "filter-button active"
              : "filter-button"
          }
          onClick={() =>
            handlePlatformChange("All")
          }
        >
          All
        </button>

        <button
          className={
            selectedPlatform === "Instagram"
              ? "filter-button active"
              : "filter-button"
          }
          onClick={() =>
            handlePlatformChange("Instagram")
          }
        >
          Instagram
        </button>

        <button
          className={
            selectedPlatform === "LinkedIn"
              ? "filter-button active"
              : "filter-button"
          }
          onClick={() =>
            handlePlatformChange("LinkedIn")
          }
        >
          LinkedIn
        </button>

        <button
          className={
            selectedPlatform === "Twitter"
              ? "filter-button active"
              : "filter-button"
          }
          onClick={() =>
            handlePlatformChange("Twitter")
          }
        >
          Twitter
        </button>

      </div>


      {/* GRAPH */}
      <div className="chart-container">

        <ResponsiveContainer
          width="100%"
          height={320}
        >
          <BarChart
            data={data}
            onClick={handleBarClick}
          >

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="date"
              label={{
                value: "September Date",
                position: "insideBottom",
                offset: -5,
              }}
            />

            <YAxis
              allowDecimals={false}
              label={{
                value: "Number of Posts",
                angle: -90,
                position: "insideLeft",
              }}
            />

            <Tooltip
              formatter={(value) => [
                value,
                "Posts",
              ]}
              labelFormatter={(label) =>
                `September ${label}`
              }
            />

            <Bar
              dataKey="posts"
              name="Posts"
              radius={[6, 6, 0, 0]}
            />

          </BarChart>
        </ResponsiveContainer>

      </div>


      {/* SELECTED DATE DETAILS */}
      {selectedDate && (
        <div className="selected-date-box">

          <div className="selected-date-header">

            <div>
              <p className="small-heading">
                SELECTED DATE
              </p>

              <h3>
                September {selectedDate}
              </h3>
            </div>

            <button
              className="clear-date-button"
              onClick={() =>
                setSelectedDate(null)
              }
            >
              Clear
            </button>

          </div>


          {selectedDatePosts.length > 0 ? (

            <div className="selected-posts">

              {selectedDatePosts.map((post) => (
                <div
                  key={post.id}
                  className={`analytics-post ${post.type.toLowerCase()}`}
                >
                  <strong>
                    {post.title}
                  </strong>

                  <span>
                    {post.type}
                    {post.time &&
                      ` • ${post.time}`}
                  </span>
                </div>
              ))}

            </div>

          ) : (

            <p className="no-posts">
              No posts scheduled for this date.
            </p>

          )}

        </div>
      )}

    </div>
  );
}

export default Analytics;