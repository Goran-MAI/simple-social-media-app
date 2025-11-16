const BASE_URL = "http://localhost:8000/posts"; // FastAPI läuft auf Port 8000

export async function getAllPosts() {
    const res = await fetch(BASE_URL + "/");
    if (!res.ok) throw new Error("Failed to fetch posts");
    return res.json();
}

export async function getPostById(postId) {
    const res = await fetch(`${BASE_URL}/${postId}`);
    if (!res.ok) throw new Error("Post not found");
    return res.json();
}

// Optional: create, update, delete
export async function createPost(postData) {
    const formData = new FormData();
    for (const key in postData) {
        formData.append(key, postData[key]);
    }
    const res = await fetch(BASE_URL + "/", {
        method: "POST",
        body: formData
    });
    if (!res.ok) throw new Error("Failed to create post");
    return res.json();
}
