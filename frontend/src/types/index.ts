export interface User {
  id: string;
  email: string;
  isVerified: boolean;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface LoginResponse {
  message: string;
  requiresOTP?: boolean;
  email?: string;
}

export interface NotesResponse {
  notes: Note[];
}

export interface ApiError {
  error: string;
}