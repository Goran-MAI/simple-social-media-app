import React, { useState, useEffect } from "react";
import { createPost, updatePost } from "../api/post";
import "../App.css";

/* -----------------------------
   Sentiment Helpers
----------------------------- */
function getSentimentClass(sentiment) {
  switch (sentiment) {
    case "positive":
    case "POSITIVE":
      return "sentiment-positive";
    case "negative":
    case "NEGATIVE":
      return "sentiment-negative";
    case "neutral":
    case "NEUTRAL":
      return "sentiment-neutral";
    default:
      return "sentiment-pending";
  }
}

function getSentimentEmoji(sentiment) {
  switch (sentiment) {
    case "positive":
    case "POSITIVE":
      return "😊";
    case "negative":
    case "NEGATIVE":
      return "😞";
    case "neutral":
    case "NEUTRAL":
      return "😐";
    default:
      return "🤖";
  }
}

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
  const [sentiment, setSentiment] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  /* -----------------------------
     Initialisierung
  ----------------------------- */
  useEffect(() => {
    if (!selectedPost) return;

    setTitle(selectedPost.title || "");
    setComment(selectedPost.comment || "");
    setSentiment(selectedPost.sentiment || null);

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
  }, [selectedPost]);

  /* -----------------------------
     Bild-Vorschau
  ----------------------------- */
  useEffect(() => {
    if (!newImage) return;

    const previewUrl = URL.createObjectURL(newImage);
    setDisplayedImage(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [newImage]);

  /* -----------------------------
     Submit
  ----------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUser && !selectedPost) return;

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

    fetchPosts();
    setFormType(null);
  };

  /* -----------------------------
     GPT2 Text Generator
  ----------------------------- */
  async function generateText(prompt) {
    if (!prompt) return;

    setIsGenerating(true);
    try {
      const response = await fetch("http://localhost:8001/generate_text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, max_length: 50 }),
      });

      const data = await response.json();
      if (data.generated_text) {
        setComment(data.generated_text);
      }
    } catch (err) {
      console.error("Text generation failed", err);
    } finally {
      setIsGenerating(false);
    }
  }

  const sentimentClass = getSentimentClass(sentiment);
  const sentimentEmoji = getSentimentEmoji(sentiment);

  /* -----------------------------
     Render
  ----------------------------- */
  return (
    <div className={`card post-form-card ${sentimentClass}`}>
      <div className="card-body">
        <div className="post-form-header">
          <h2>
            {selectedPost
              ? "Edit Post"
              : `Create Post for ${selectedUser.username}`}
          </h2>

          <span className="post-form-emoji">
            {sentimentEmoji}
            <span className="tooltip-text">
              {sentiment ? `Sentiment: ${sentiment}` : "Analyse läuft"}
            </span>
          </span>
        </div>

        {createdAt && <p>Created at: {new Date(createdAt).toLocaleString()}</p>}
        {updatedAt && <p>Updated at: {new Date(updatedAt).toLocaleString()}</p>}

        {/* Sentiment-Text absichtlich ausgeblendet */}
        <p className="sentiment-text-hidden">
          Sentiment: {sentiment ?? "pending"}
        </p>

        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          {/* -----------------------------
              Kommentar mit Generate-Button
          ----------------------------- */}
          <div className="textarea-wrapper mb-3">
            <textarea
              className="form-control"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-sm btn-secondary generate-btn"
              disabled={isGenerating}
              onClick={() => generateText(title)}
            >
              {isGenerating ? "..." : "Generate"}
            </button>
          </div>

          <input
            type="file"
            className="form-control mb-3"
            accept="image/*"
            onChange={(e) => setNewImage(e.target.files[0])}
          />

          {displayedImage && (
            <div className="image-preview-wrapper">
              <a
                href={
                  selectedPost?.img_path
                    ? `http://localhost:8000/${selectedPost.img_path}`
                    : displayedImage
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={displayedImage}
                  className="post-image-preview"
                  alt="Post"
                />
              </a>
            </div>
          )}

          <button className="btn-save mt-3" type="submit">
            {selectedPost ? "Save Changes" : "Create Post"}
          </button>
        </form>
      </div>
    </div>
  );
}
