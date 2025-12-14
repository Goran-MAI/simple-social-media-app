// src/components/PostForm.jsx
import React, { useState, useEffect, useRef } from "react";
import { createPost, updatePost } from "../api/post";

export default function PostForm({ selectedUser, selectedPost, setFormType, fetchPosts }) {

  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [createdAt, setCreatedAt] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [displayedImage, setDisplayedImage] = useState(null);

  const pollerRef = useRef(null); // store poller ID

  // Initialize form whenever selectedPost changes
  useEffect(() => {
    if (selectedPost) {
      setTitle(selectedPost.title || "");
      setComment(selectedPost.comment || "");
      setExistingImage(selectedPost.img_small_path || selectedPost.img_path || null);
      setNewImage(null);
      setCreatedAt(selectedPost.creation_date || "");
      setUpdatedAt(selectedPost.update_date || "");
    } else {
      setTitle("");
      setComment("");
      setExistingImage(null);
      setNewImage(null);
      setCreatedAt("");
    }
  }, [selectedPost]);

  // Update displayed image whenever newImage or existingImage changes
  useEffect(() => {
    if (newImage) {
      setDisplayedImage(URL.createObjectURL(newImage));
    } else if (existingImage) {
      setDisplayedImage(`http://localhost:8000/${existingImage}`);
    } else {
      setDisplayedImage(null);
    }
  }, [newImage, existingImage]);

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setNewImage(file);
  };

  // Helper: construct small image path
  const getSmallImagePath = (path) => {
    if (!path) return null;
    const dotIndex = path.lastIndexOf(".");
    if (dotIndex === -1) return path + "_small";
    return path.substring(0, dotIndex) + "_small" + path.substring(dotIndex);
  };

  // Poll backend for small image after upload
  useEffect(() => {
    // clear any existing poller
    if (pollerRef.current) {
      clearInterval(pollerRef.current);
      pollerRef.current = null;
    }

    if (!newImage) return;

    const filename = newImage.name;
    const smallPath = getSmallImagePath(filename);
const smallUrl = `http://localhost:8000/uploads/${smallPath}`;

    const checkSmallImage = async () => {
      try {
        const response = await fetch(smallUrl, { method: "HEAD" });
        if (response.ok) {
            setDisplayedImage(smallUrl);
            if (pollerRef.current) {
                clearInterval(pollerRef.current);
                pollerRef.current = null;
            }
        }
      } catch (err) {
        // small image not yet available, ignore
      }
    };

    pollerRef.current = setInterval(checkSmallImage, 1500);

    // Cleanup on unmount or image change
    return () => {
      if (pollerRef.current) {
        clearInterval(pollerRef.current);
        pollerRef.current = null;
      }
    };

  }, [newImage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser && !selectedPost) return;

    try {
      if (selectedPost) {
        await updatePost(selectedPost.id, {
          title,
          comment,
          img: newImage,
        });
      } else {
        await createPost({
          user_id: selectedUser.id,
          title,
          comment,
          img: newImage,
        });
      }

      setFormType(null);
      fetchPosts();
    } catch (err) {
      console.error(err);
      alert("Error saving post");
    }
  };

  return (
    <div className="card" id="postForm">
      <div className="card-body">
        <h2>{selectedPost ? "Edit Post" : `Create Post for ${selectedUser.username}`}</h2>
        {selectedPost && createdAt && (
          <span className="post-created-at">Created at: {new Date(createdAt).toLocaleString()}</span>
        )}
        {selectedPost && updatedAt && (
          <p className="post-created-at">Updated at: {new Date(updatedAt).toLocaleString()}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Title</label>
            <input
              type="text"
              className="form-control post-input"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="comment" className="form-label">Comment</label>
            <textarea
              className="form-control post-input"
              placeholder="Comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div className="input-group pb-3">
            <input
              type="file"
              className="form-control post-input"
              accept="image/*"
              onChange={handleImageChange}
              aria-label="Upload"
            />
          </div>

          {displayedImage && (
            <div className="post-image-preview">
              <img
                src={displayedImage}
                className="rounded-3 mx-auto d-block"
                alt="Post"
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
