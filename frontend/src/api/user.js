const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// --- GET ---
export async function getAllUsers() {
    const res = await fetch(`${API_URL}/users/`);
    if (!res.ok) throw new Error("Failed to fetch users");
    return res.json();
}

export async function getUserById(userId) {
    const res = await fetch(`${API_URL}/users/${userId}`);
    if (!res.ok) throw new Error("User not found");
    return res.json();
}

export async function getUserByUsername(username) {
    const res = await fetch(`${API_URL}/users/username/${username}`);
    if (!res.ok) throw new Error("User not found");
    return res.json();
}

// --- CREATE ---
export async function createUser(user) {
  const formData = new FormData();
  Object.keys(user).forEach(key => formData.append(key, user[key]));

  const res = await fetch(`${API_URL}/users/`, { method: "POST", body: formData });
  if (!res.ok) throw new Error("Failed to create user");
  return res.json();
}

// --- UPDATE ---
export async function updateUser(userId, updatedUser) {
  const formData = new FormData();
  Object.keys(updatedUser).forEach(key => formData.append(key, updatedUser[key]));

  const res = await fetch(`${API_URL}/users/${userId}`, { method: "PUT", body: formData });
  if (!res.ok) throw new Error("Failed to update user");
  return res.json();
}
