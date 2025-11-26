export type BookStatus = 'not_started' | 'reading' | 'finished';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Book {
  _id: string;
  title: string;
  author: string;
  description?: string;
  coverImageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  ratingAvg?: number;
  ratingCount?: number;
  userRating?: number;
}

export interface ShelfEntry {
  _id: string;
  book: Book;
  status: BookStatus;
  createdAt?: string;
  updatedAt?: string;
}
