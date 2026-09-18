import { useState } from "react";

const EMPTY_POST = {
  title: "",
  platform: "LinkedIn",
  date: "2026-09-07",
  time: "8:00 AM",
};

function CreatePostModal({
  post,
  onSave,
  onDelete,
  onClose,
}) {
  const [form, setForm] = useState(
    post || EMPTY_POST
  );

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      return;
    }

    onSave(form);
  };

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="modal">
        <h2>
          {post ? "Edit Post" : "Create Post"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Post Title</label>

            <input
              value={form.title}
              onChange={(event) =>
                updateField(
                  "title",
                  event.target.value
                )
              }
              placeholder="Enter post title"
            />
          </div>

          <div className="form-group">
            <label>Platform</label>

            <select
              value={form.platform}
              onChange={(event) =>
                updateField(
                  "platform",
                  event.target.value
                )
              }
            >
              <option>LinkedIn</option>
              <option>Instagram</option>
              <option>Twitter</option>
            </select>
          </div>

          <div className="form-group">
            <label>Date</label>

            <input
              type="date"
              value={form.date}
              onChange={(event) =>
                updateField(
                  "date",
                  event.target.value
                )
              }
            />
          </div>

          <div className="form-group">
            <label>Time</label>

            <select
              value={form.time}
              onChange={(event) =>
                updateField(
                  "time",
                  event.target.value
                )
              }
            >
              <option>8:00 AM</option>
              <option>9:00 AM</option>
              <option>10:00 AM</option>
              <option>11:00 AM</option>
              <option>12:00 PM</option>
              <option>1:00 PM</option>
              <option>2:00 PM</option>
              <option>3:00 PM</option>
              <option>4:00 PM</option>
              <option>5:00 PM</option>
            </select>
          </div>

          <div className="modal-actions">
            {post && (
              <button
                type="button"
                className="danger-button"
                onClick={() =>
                  onDelete(post.id)
                }
              >
                Delete
              </button>
            )}

            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-button"
            >
              {post ? "Save Changes" : "Create Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePostModal;