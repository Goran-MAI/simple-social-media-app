import React from "react";

export default function PostList({ posts, selectedPost, setSelectedPost, selectedUser, setFormType }) {
  return (
    <div style={{ flex: 1, borderLeft: "1px solid #ccc", padding: "10px" }}>
      <h2>Posts</h2>
      <button
        onClick={() => {
          if (selectedUser) {
            setFormType("post");
          } else {
            alert("Please select a user first!");
          }
        }}
      >
        + Add Post
      </button>
      <ul>
        {posts.map((post) => (
          <li
            key={post.id}
            onClick={() => setSelectedPost(post)}
            style={{
              cursor: "pointer",
              fontWeight: selectedPost?.id === post.id ? "bold" : "normal",
            }}
          >
            {post.title} - {post.comment}
          </li>
        ))}
      </ul>
    </div>
  );
}
