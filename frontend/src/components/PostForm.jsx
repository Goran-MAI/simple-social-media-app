// src/components/PostForm.jsx
import React, { useState, useEffect } from "react";
import { createPost, updatePost } from "../api/post";

export default function PostForm({ selectedUser, selectedPost, setFormType, fetchPosts }) {
  if (!selectedUser) return <p>Please select a user first</p>;

  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [newImage, setNewImage] = useState(null);       // hochgeladenes File
  const [existingImage, setExistingImage] = useState(null); // Bild aus DB
  const [createdAt, setCreatedAt] = useState("");

  // Initialisierung beim Post-Wechsel
  useEffect(() => {
    if (selectedPost) {
      setTitle(selectedPost.title || "");
      setComment(selectedPost.comment || "");
      setExistingImage(selectedPost.img_path || null); // <<< hier auf img_path achten
      setNewImage(null);
      setCreatedAt(selectedPost.creation_date || "");
    } else {
      setTitle("");
      setComment("");
      setExistingImage(null);
      setNewImage(null);
      setCreatedAt("");
    }
  }, [selectedPost]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setNewImage(file);
  };

  // Bild, das angezeigt wird: neues File oder bestehendes Bild aus DB
  const displayedImage = newImage
    ? URL.createObjectURL(newImage)
    : existingImage
    ? `http://localhost:8000/${existingImage}` // <<< bestehendes Bild korrekt einbinden
    : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser && !selectedPost) return;

    try {
      if (selectedPost) {
        // Update bestehender Post
        await updatePost(selectedPost.id, {
          title,
          comment,
          img: newImage,
        });
      } else {
        // Neuer Post
        await createPost({
          user_id: selectedUser.id,
          title,
          comment,
          img: newImage,
        });
      }

      setFormType(null); // Form schließen
      fetchPosts();       // Liste neu laden
    } catch (err) {
      console.error(err);
      alert("Fehler beim Speichern des Posts");
    }
  };

  return (
    <div className="form-container">
      <h2>{selectedPost ? "Edit Post" : `Create Post for ${selectedUser.username}`}</h2>

      {selectedPost && createdAt && (
        <p className="post-created-at">Created at: {new Date(createdAt).toLocaleString()}</p>
      )}

      {displayedImage && (
        <div className="post-image-preview">
          <img src={displayedImage} alt="Post" />
        </div>
      )}

      <form onSubmit={handleSubmit} className="post-form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="post-input"
        />

        <textarea
          placeholder="Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="post-input"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="post-input"
        />

        <button type="submit" className="btn-save">
          Save Post
        </button>
      </form>
    </div>
  );
}
