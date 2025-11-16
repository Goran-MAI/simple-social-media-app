import { create } from "zustand";

interface User {
  id: number
  name: string
  surname: string
  username: string
  email: string
}

interface UserStore {
  users: User[]
  setUsers: (users: User[]) => void
  addUser: (user: User) => void
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


export const useUserStore = create<UserStore>((set) => ({
  users: [],
  setUsers: (users) => set({ users }),
  addUser: (u) => set((state) => ({ users: [...state.users, u] }))
}));

export const userService = new UserService()