interface Post {
  id: number
  user_id: number | null
  title: string
  comment: string
  creation_date: string
  updated_date: string
  img_path: string
}

class PostService {
  private baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

  async getPosts(): Promise<Post[]> {
    const res = await fetch(`${this.baseUrl}/posts/`)
    if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`)
    return res.json()
  }

  async getPostsByUserId(userId: number): Promise<Post[]> {
    const res = await fetch(`${this.baseUrl}/users/${userId}/posts`)
    if (!res.ok) throw new Error(`Failed to fetch posts for user ${userId}: ${res.status}`)
    return res.json()
  }

  async createPost(post: Omit<Post, 'id'>): Promise<Post> {
    const formData = new FormData();

    formData.append("user_id", (post.user_id ?? 1).toString());
    formData.append("title", post.title);
    formData.append("comment", post.comment);
    formData.append("img_path", post.img_path);

    const res = await fetch(`${this.baseUrl}/posts/`, {
      method: 'POST',
      body: formData,
    });
    
    if (!res.ok) throw new Error('Failed to create post');
    return res.json();
  }


}

export const postService = new PostService()