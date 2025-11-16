interface User {
  id: number
  name: string
  surname: string
  username: string
  email: string
}

class UserService {
  private baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/users'

  async getUsers(): Promise<User[]> {
    const res = await fetch(`${this.baseUrl}`)
    if (!res.ok) throw new Error(`Failed to fetch users: ${res.status}`)
    return res.json()
  }

  async getUserById(id: number): Promise<User> {
    const res = await fetch(`${this.baseUrl}/${id}`)
    if (!res.ok) throw new Error(`Failed to fetch user: ${res.status}`)
    return res.json()
  }

  async createUser(user: Omit<User, 'id'>): Promise<User> {
    const formData = new FormData();

    formData.append("username", user.username);
    formData.append("name", user.name);
    formData.append("surname", user.surname);
    formData.append("email", user.email);

    const res = await fetch(`${this.baseUrl}`, {
      method: 'POST',
      body: formData,
    });
    
    if (!res.ok) throw new Error('Failed to create user');
    return res.json();
  }
}

export const userService = new UserService()