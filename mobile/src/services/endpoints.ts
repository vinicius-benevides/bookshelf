import { AuthResponse, Book, BookStatus, ShelfEntry } from '../types/api';
import api from './api';

export const authApi = {
  login: (email: string, password: string) => api.post<AuthResponse>('/auth/login', { email, password }),
  register: (name: string, email: string, password: string) =>
    api.post<AuthResponse>('/auth/register', { name, email, password }),
};

export const booksApi = {
  list: (search?: string, sort?: 'date' | 'title' | 'rating') =>
    api.get<Book[]>('/books', { params: { ...(search ? { search } : {}), ...(sort ? { sort } : {}) } }),
  getById: (id: string) => api.get<Book>(`/books/${id}`),
  create: (data: { title: string; author: string; description?: string; coverUri?: string; coverUrl?: string }) => {
    const form = new FormData();
    form.append('title', data.title);
    form.append('author', data.author);
    if (data.description) form.append('description', data.description);

    if (data.coverUri) {
      const file: any = {
        uri: data.coverUri,
        name: 'cover.jpg',
        type: 'image/jpeg',
      };
      form.append('cover', file);
    } else if (data.coverUrl) {
      form.append('coverUrl', data.coverUrl);
    }

    return api.post<Book>('/books', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  rate: (id: string, score: number) => api.patch<{ ratingAvg: number; ratingCount: number }>(`/books/${id}/rating`, { score }),
};

export const shelfApi = {
  list: () => api.get<ShelfEntry[]>('/shelf'),
  add: (bookId: string) => api.post<ShelfEntry>('/shelf', { bookId }),
  updateStatus: (bookId: string, status: BookStatus) => api.patch<ShelfEntry>(`/shelf/${bookId}`, { status }),
  remove: (bookId: string) => api.delete(`/shelf/${bookId}`),
};
