import React, { useState } from "react";
import "./PostComposer.css";

const platforms = {
  instagram: {
    name: "📷 Instagram",
    limit: 2200,
  },
  twitter: {
    name: "🐦 X (Twitter)",
    limit: 280,
  },
  linkedin: {
    name: "💼 LinkedIn",
    limit: 3000,
  },
  facebook: {
    name: "📘 Facebook",
    limit: 63206,
  },
};

export default function PostComposer() {
  const [platform, setPlatform] = useState("instagram");
  const [post, setPost] = useState("");
  const [message, setMessage] = useState("");

  const limit = platforms[platform].limit;
  const characters = post.length;
  const remaining = limit - characters;
  const exceeded = characters > limit;

  const publishPost = () => {
    if (!post.trim()) {
      setMessage("❌ Please write a post.");
      return;
    }

    if (exceeded) {
      setMessage("❌ Character limit exceeded!");
      return;
    }

    setMessage(
      `✅ Post published successfully on ${platforms[platform].name}`
    );
  };

  return (
    <div className="container">

      <h1>Dynamic Multi-Platform Post Composer</h1>

      <div className="card">

        <label>Select Platform</label>

        <select
          value={platform}
          onChange={(e) => {
            setPlatform(e.target.value);
            setMessage("");
          }}
        >
          {Object.keys(platforms).map((key) => (
            <option key={key} value={key}>
              {platforms[key].name}
            </option>
          ))}
        </select>

        <label>Write Your Post</label>

        <textarea
          placeholder="What's on your mind?"
          value={post}
          onChange={(e) => {
            setPost(e.target.value);
            setMessage("");
          }}
        />

        <div className="counter">

          <span className={exceeded ? "red" : "green"}>
            {characters} / {limit}
          </span>

          <span>{remaining} Remaining</span>

        </div>

        {exceeded && (
          <p className="error">
            Character limit exceeded by {characters - limit}
          </p>
        )}

        <button onClick={publishPost}>
          Publish Post
        </button>

        {message && (
          <p
            className={
              message.includes("successfully")
                ? "success"
                : "error"
            }
          >
            {message}
          </p>
        )}

      </div>

      <div className="preview">

        <h2>📱 Live Preview</h2>

        <div className="previewBox">

          <h3>{platforms[platform].name}</h3>

          <p>
            {post || "Your post will appear here..."}
          </p>

        </div>

      </div>

    </div>
  );
}