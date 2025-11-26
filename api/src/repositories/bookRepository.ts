import { FilterQuery } from 'mongoose';
import Book, { IBook } from '../models/Book';

export const bookRepository = {
  create: (data: Pick<IBook, 'title' | 'author' | 'description' | 'coverImageUrl' | 'createdBy'>) =>
    Book.create(data),
  list: (search?: string) => {
    const filter: FilterQuery<IBook> =
      search && search.trim().length
        ? {
            $or: [
              { title: { $regex: search, $options: 'i' } },
              { author: { $regex: search, $options: 'i' } },
            ],
          }
        : {};
    return Book.find(filter).sort({ createdAt: -1 });
  },
  getById: (id: string) => Book.findById(id),
};

export type BookDocument = Awaited<ReturnType<typeof bookRepository.create>>;
