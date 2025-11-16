const API_URL = "http://localhost:8000";

// --- GET ---
export async function getAllPosts() {
  const res = await fetch(`${API_URL}/posts/`);
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export async function getPostById(id) {
  const res = await fetch(`${API_URL}/posts/${id}`);
  if (!res.ok) throw new Error("Post not found");
  return res.json();
}

export async function getPostsByQuery(query) {
  const res = await fetch(`${API_URL}/posts/search?query=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Failed to fetch posts by query");
  return res.json();
}

export async function getPostsByUserId(userId) {
  const res = await fetch(`${API_URL}/users/${userId}/posts`);
  if (!res.ok) throw new Error("Failed to fetch user's posts");
  return res.json();
}

// --- CREATE ---
export async function createPost({ user_id, title, comment, img }) {
  const formData = new FormData();
  formData.append("user_id", user_id);
  formData.append("title", title);
  formData.append("comment", comment);
  if (img) formData.append("img", img);

  const res = await fetch(`${API_URL}/posts/`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to create post");
  return res.json();
}

// --- UPDATE ---
export async function updatePost(post_id, { title, comment, img }) {
  const formData = new FormData();
  if (title !== undefined) formData.append("title", title);
  if (comment !== undefined) formData.append("comment", comment);
  if (img) formData.append("img", img);

  const res = await fetch(`${API_URL}/posts/${post_id}`, {
    method: "PUT",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to update post");
  return res.json();
}

// --- DELETE ---
export async function deletePost(post_id) {
  const res = await fetch(`${API_URL}/posts/${post_id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete post");
  return res.json();
}
