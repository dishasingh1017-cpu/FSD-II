import { useState } from "react";

function AddPostModal({ onClose, onAddPost }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("2026-09-15");
  const [time, setTime] = useState("10:00");
  const [type, setType] = useState("Instagram");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!title.trim()) {
      alert("Please enter a post title");
      return;
    }

    onAddPost({
      id: Date.now(),
      title,
      date: Number(date.split("-")[2]),
      time,
      type,
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Add New Post</h2>

          <button
            className="close-button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Post Title</label>
          <input
            type="text"
            placeholder="Enter post title"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
          />

          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(event) =>
              setDate(event.target.value)
            }
          />

          <label>Time</label>
          <input
            type="time"
            value={time}
            onChange={(event) =>
              setTime(event.target.value)
            }
          />

          <label>Platform</label>
          <select
            value={type}
            onChange={(event) =>
              setType(event.target.value)
            }
          >
            <option value="Instagram">
              Instagram
            </option>
            <option value="LinkedIn">
              LinkedIn
            </option>
            <option value="Twitter">
              Twitter
            </option>
          </select>

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-button"
            >
              Add Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPostModal;