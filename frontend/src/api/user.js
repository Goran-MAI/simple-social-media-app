const BASE_URL = "http://localhost:8000/users";

export async function getAllUsers() {
    const res = await fetch(BASE_URL + "/");
    if (!res.ok) throw new Error("Failed to fetch users");
    return res.json();
}

export async function getUserById(userId) {
    const res = await fetch(`${BASE_URL}/${userId}`);
    if (!res.ok) throw new Error("User not found");
    return res.json();
}

export async function getUserByUsername(username) {
    const res = await fetch(`${BASE_URL}/username/${username}`);
    if (!res.ok) throw new Error("User not found");
    return res.json();
}

// Optional: create and delete
export async function createUser(userData) {
    const formData = new FormData();
    for (const key in userData) {
        formData.append(key, userData[key]);
    }
    const res = await fetch(BASE_URL + "/", {
        method: "POST",
        body: formData
    });
    if (!res.ok) throw new Error("Failed to create user");
    return res.json();
}
