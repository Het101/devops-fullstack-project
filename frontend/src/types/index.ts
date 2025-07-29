export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  slug: string;
  published: boolean;
  author: User;
  createdAt: string;
  updatedAt: string;
}
