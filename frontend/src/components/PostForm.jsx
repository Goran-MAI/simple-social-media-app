import React, { useState, useEffect } from "react";
import { createPost, updatePost } from "../api/post";

export default function PostForm({
  selectedUser,
  selectedPost,
  setFormType,
  fetchPosts,
}) {
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [displayedImage, setDisplayedImage] = useState(null);
  const [createdAt, setCreatedAt] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");

  /* -----------------------------
     Initialisierung bei Post-Wechsel
  ----------------------------- */
  useEffect(() => {
    if (selectedPost) {
      setTitle(selectedPost.title || "");
      setComment(selectedPost.comment || "");
      setDisplayedImage(
        selectedPost.img_small_path
          ? `http://localhost:8000/${selectedPost.img_small_path}`
          : selectedPost.img_path
          ? `http://localhost:8000/${selectedPost.img_path}`
          : null
      );
      setCreatedAt(selectedPost.creation_date || "");
      setUpdatedAt(selectedPost.update_date || "");
      setNewImage(null);
    } else {
      setTitle("");
      setComment("");
      setDisplayedImage(null);
      setNewImage(null);
      setCreatedAt("");
      setUpdatedAt("");
    }
  }, [selectedPost]);

  /* -----------------------------
     Lokale Vorschau für neue Datei
  ----------------------------- */
  useEffect(() => {
    if (!newImage) return;

    const previewUrl = URL.createObjectURL(newImage);
    setDisplayedImage(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [newImage]);

  /* -----------------------------
     File-Change Handler
  ----------------------------- */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setNewImage(file);
  };

  /* -----------------------------
     Submit
  ----------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser && !selectedPost) return;

    try {
      // Post erstellen oder updaten
      const result = selectedPost
        ? await updatePost(selectedPost.id, {
            title,
            comment,
            img: newImage,
          })
        : await createPost({
            user_id: selectedUser.id,
            title,
            comment,
            img: newImage,
          });

      // Direkt das Small-Bild anzeigen
      if (result?.img_small_path) {
        setDisplayedImage(`http://localhost:8000/${result.img_small_path}`);
      } else if (result?.img_path) {
        setDisplayedImage(`http://localhost:8000/${result.img_path}`);
      }

      fetchPosts();
      setFormType(null);
    } catch (err) {
      console.error(err);
      alert("Error saving post");
    }
  };

  /* -----------------------------
     Render
  ----------------------------- */
  return (
    <div className="card" id="postForm">
      <div className="card-body">
        <h2>
          {selectedPost
            ? "Edit Post"
            : `Create Post for ${selectedUser.username}`}
        </h2>

        {createdAt && <p>Created at: {new Date(createdAt).toLocaleString()}</p>}
        {updatedAt && <p>Updated at: {new Date(updatedAt).toLocaleString()}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Comment</label>
            <textarea
              className="form-control"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div className="input-group pb-3">
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          {displayedImage && (
            <div className="post-image-preview">
              <img
                src={displayedImage}
                alt="Post"
                className="rounded-3 mx-auto d-block"
              />
            </div>
          )}

          <button type="submit" className="btn-save mt-3">
            {selectedPost ? "Save Changes" : "Create Post"}
          </button>
        </form>
      </div>
    </div>
  );
}
