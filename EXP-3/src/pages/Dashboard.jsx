import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "My First Post",
      content:
        "This is an example post for our authentication and RBAC project.",
    },
  ]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Notification
  const [notification, setNotification] = useState({
    message: "",
    type: "",
  });

  // Automatically hide notification after 3 seconds
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({
          message: "",
          type: "",
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  if (!user) {
    return (
      <div className="page-center">
        <div className="error-card">
          <h2>No user logged in</h2>

          <button onClick={() => navigate("/")}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const isAdmin = user.role === "admin";
  const isEditor = user.role === "editor";
  const isViewer = user.role === "viewer";

  // =========================
  // SHOW NOTIFICATION
  // =========================

  const showNotification = (message, type = "success") => {
    setNotification({
      message,
      type,
    });
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // =========================
  // CREATE POST
  // =========================

  const handleCreate = (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      showNotification(
        "Please enter title and content.",
        "error"
      );
      return;
    }

    const newPost = {
      id: Date.now(),
      title: title.trim(),
      content: content.trim(),
    };

    setPosts((previousPosts) => [
      ...previousPosts,
      newPost,
    ]);

    setTitle("");
    setContent("");

    showNotification(
      "Post created successfully!",
      "success"
    );
  };

  // =========================
  // START EDIT
  // =========================

  const handleEdit = (post) => {
    setEditingId(post.id);
    setTitle(post.title);
    setContent(post.content);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // UPDATE POST
  // =========================

  const handleUpdate = (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      showNotification(
        "Please enter title and content.",
        "error"
      );
      return;
    }

    setPosts((previousPosts) =>
      previousPosts.map((post) =>
        post.id === editingId
          ? {
              ...post,
              title: title.trim(),
              content: content.trim(),
            }
          : post
      )
    );

    setEditingId(null);
    setTitle("");
    setContent("");

    showNotification(
      "Post updated successfully!",
      "success"
    );
  };

  // =========================
  // DELETE POST
  // =========================

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmDelete) {
      return;
    }

    setPosts((previousPosts) =>
      previousPosts.filter((post) => post.id !== id)
    );

    showNotification(
      "Post deleted successfully!",
      "success"
    );
  };

  // =========================
  // CANCEL EDIT
  // =========================

  const handleCancel = () => {
    setEditingId(null);
    setTitle("");
    setContent("");

    showNotification(
      "Edit cancelled.",
      "info"
    );
  };

  return (
    <div className="dashboard-page">

      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="navbar">

        <div className="logo">
          🔐 SecureAuth
        </div>

        <div className="nav-user">

          <span>{user.username}</span>

          <span className={`role-badge ${user.role}`}>
            {user.role.toUpperCase()}
          </span>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>

      {/* =========================
          NOTIFICATION
      ========================= */}

      {notification.message && (
        <div
          className={`notification ${notification.type}`}
        >
          <span>
            {notification.type === "success" && "✅"}
            {notification.type === "error" && "❌"}
            {notification.type === "info" && "ℹ️"}
          </span>

          <span>
            {notification.message}
          </span>

          <button
            onClick={() =>
              setNotification({
                message: "",
                type: "",
              })
            }
          >
            ×
          </button>
        </div>
      )}

      {/* =========================
          MAIN
      ========================= */}

      <main className="dashboard-container">

        {/* Welcome */}

        <div className="welcome-section">

          <h1>
            Posts Dashboard
          </h1>

          <p>
            Welcome, <strong>{user.username}</strong> 👋
          </p>

          <p className="role-text">
            You are logged in as{" "}
            <strong>{user.role}</strong>
          </p>

        </div>

        {/* =========================
            CREATE / EDIT FORM
        ========================= */}

        {!isViewer && (
          <div className="post-form">

            <h2>
              {editingId
                ? "Edit Post"
                : "Create New Post"}
            </h2>

            <form
              onSubmit={
                editingId
                  ? handleUpdate
                  : handleCreate
              }
            >

              <input
                type="text"
                placeholder="Enter post title"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
              />

              <textarea
                placeholder="Enter post content"
                value={content}
                onChange={(e) =>
                  setContent(e.target.value)
                }
              />

              <div className="form-buttons">

                <button
                  type="submit"
                  className="create-btn"
                >
                  {editingId
                    ? "Update Post"
                    : "Create Post"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                )}

              </div>

            </form>

          </div>
        )}

        {/* =========================
            POSTS
        ========================= */}

        <div className="posts-section">

          <div className="posts-header">

            <div>

              <h2>
                All Posts
              </h2>

              <p>
                {isAdmin &&
                  "Admin: You have full access."}

                {isEditor &&
                  "Editor: You can create and edit posts."}

                {isViewer &&
                  "Viewer: You have view-only access."}
              </p>

            </div>

          </div>

          {/* POST LIST */}

          {posts.length === 0 ? (

            <div className="post-card">
              <p>No posts available.</p>
            </div>

          ) : (

            posts.map((post) => (

              <div
                className="post-card"
                key={post.id}
              >

                <div className="post-content">

                  <h3>
                    {post.title}
                  </h3>

                  <p>
                    {post.content}
                  </p>

                  <span className="post-author">
                    Post ID: {post.id}
                  </span>

                </div>

                {/* ACTIONS */}

                <div className="post-actions">

                  {/* EDIT */}

                  {isAdmin || isEditor ? (

                    <button
                      className="edit-btn"
                      onClick={() =>
                        handleEdit(post)
                      }
                    >
                      ✏️ Edit
                    </button>

                  ) : (

                    <button
                      className="edit-btn disabled-btn"
                      disabled
                    >
                      ✏️ Edit
                    </button>

                  )}

                  {/* DELETE */}

                  {isAdmin ? (

                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDelete(post.id)
                      }
                    >
                      🗑️ Delete
                    </button>

                  ) : (

                    <button
                      className="delete-btn disabled-btn"
                      disabled
                    >
                      🗑️ Delete
                    </button>

                  )}

                </div>

              </div>

            ))

          )}

        </div>

      </main>

    </div>
  );
}

export default Dashboard;