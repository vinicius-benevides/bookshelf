import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { bookRepository } from '../repositories/bookRepository';

export const createBook = async (req: Request, res: Response) => {
  try {
    const { title, author, description, coverUrl } = req.body;

    if (!title || !author) {
      return res.status(400).json({ message: 'Title and author are required' });
    }

    const coverImageUrl = req.file ? `/uploads/${req.file.filename}` : coverUrl;
    const book = await bookRepository.create({
      title,
      author,
      description,
      coverImageUrl,
      createdBy: req.userId,
    });

    return res.status(201).json(book);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create book' });
  }
};

export const listBooks = async (req: Request, res: Response) => {
  try {
    const search = (req.query.search as string) || '';
    const sortParam = (req.query.sort as string) || '';
    const sort: 'date' | 'title' | 'rating' = sortParam === 'title' ? 'title' : sortParam === 'rating' ? 'rating' : 'date';
    const books = await bookRepository.list(search, sort, req.userId);
    return res.json(books);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load books' });
  }
};

export const getBookById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }

    const bookList = await bookRepository.getById(id, req.userId);
    const book = bookList[0];

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.json(book);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load book' });
  }
};

export const rateBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { score } = req.body as { score?: number };

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }
    if (typeof score !== 'number' || score < 0 || score > 5) {
      return res.status(400).json({ message: 'Score must be between 0 and 5' });
    }

    const result = await bookRepository.rate(id, req.userId!, score);
    if (!result) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.json({
      ratingAvg: result.ratingAvg,
      ratingCount: result.ratingCount,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to rate book' });
  }
};
