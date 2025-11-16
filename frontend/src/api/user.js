const API_URL = "http://localhost:8000/users";

export async function getAllUsers() {
    const res = await fetch(API_URL + "/");
    if (!res.ok) throw new Error("Failed to fetch users");
    return res.json();
}

export async function getUserById(userId) {
    const res = await fetch(`${API_URL}/${userId}`);
    if (!res.ok) throw new Error("User not found");
    return res.json();
}

export async function getUserByUsername(username) {
    const res = await fetch(`${API_URL}/username/${username}`);
    if (!res.ok) throw new Error("User not found");
    return res.json();
}

// create
export async function createUser(user) {
  const formData = new FormData();
  Object.keys(user).forEach(key => formData.append(key, user[key]));
  const res = await fetch(API_URL, { method: "POST", body: formData });
  if (!res.ok) throw new Error("Failed to create user");
  return res.json();
}


// update user
export async function updateUser(userId, updatedUser) {
  const formData = new FormData();
  Object.keys(updatedUser).forEach(key => formData.append(key, updatedUser[key]));

  const res = await fetch(`${API_URL}/${userId}`, {
    method: "PUT",
    body: formData
  });

  if (!res.ok) throw new Error("Failed to update user");
  return res.json();
}
