import { Request, Response } from 'express';
import { bookRepository } from '../repositories/bookRepository';
import ShelfEntry, { BookStatus, isValidBookStatus } from '../models/ShelfEntry';
import { shelfRepository } from '../repositories/shelfRepository';

export const listShelf = async (req: Request, res: Response) => {
  try {
    const shelf = await shelfRepository.listByUser(req.userId!);

    return res.json(shelf);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load shelf' });
  }
};

export const addToShelf = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.body as { bookId?: string };

    if (!bookId) {
      return res.status(400).json({ message: 'Book id is required' });
    }

    const book = await bookRepository.getById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const shelfEntry = await shelfRepository.upsertEntry(req.userId!, bookId, 'not_started');

    return res.status(201).json(shelfEntry);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to add book to shelf' });
  }
};

export const updateShelfStatus = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;
    const { status } = req.body as { status?: BookStatus };

    if (!status || !isValidBookStatus(status)) {
      return res.status(400).json({ message: 'Invalid status. Use "not_started", "reading" or "finished".' });
    }

    const shelfEntry = await shelfRepository.updateStatus(req.userId!, bookId, status);

    if (!shelfEntry) {
      return res.status(404).json({ message: 'Book not found in shelf' });
    }

    return res.json(shelfEntry);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update status' });
  }
};

export const removeFromShelf = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;

    const removed = await shelfRepository.remove(req.userId!, bookId);
    if (!removed) {
      return res.status(404).json({ message: 'Book not found in shelf' });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: 'Failed to remove book from shelf' });
  }
};
