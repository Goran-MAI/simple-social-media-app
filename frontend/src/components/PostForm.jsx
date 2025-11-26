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
    <div className="card" id="postForm">
        <div className="card-body">
            <h2>{selectedPost ? "Edit Post" : `Create Post for ${selectedUser.username}`}</h2>
            {selectedPost && createdAt && (
              <p className="post-created-at">Created at: {new Date(createdAt).toLocaleString()}</p>
            )}
            
            <form onSubmit={handleSubmit} >
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input type="text" className="form-control post-input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required/>
                </div>
                <div className="mb-3">
                    <label htmlFor="comment" className="form-label">Comment</label>
                    <textarea className="form-control post-input" placeholder="Comment" value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
                </div>

                <div className="input-group">
                  <input type="file" class="form-control post-input" accept="image/*" onChange={handleImageChange} aria-label="Upload"/>
                </div>

                {displayedImage && (
              <div className="post-image-preview">
                <img src={displayedImage} className="rounded mx-auto d-block" alt="Post" />

                
              </div>
            )}

                <button type="submit" className="btn-save" >{selectedPost ? "Save Changes" : "Create Post"}</button>
            </form>
          </div>
      </div>
  );
}
