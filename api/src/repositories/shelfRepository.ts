import ShelfEntry, { BookStatus } from '../models/ShelfEntry';

export const shelfRepository = {
  listByUser: (userId: string) =>
    ShelfEntry.find({ user: userId }).populate('book').sort({ updatedAt: -1 }),

  upsertEntry: (userId: string, bookId: string, status: BookStatus = 'not_started') =>
    ShelfEntry.findOneAndUpdate(
      { user: userId, book: bookId },
      { $setOnInsert: { status } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).populate('book'),

  findByUserAndBook: (userId: string, bookId: string) =>
    ShelfEntry.findOne({ user: userId, book: bookId }).populate('book'),

  updateStatus: (userId: string, bookId: string, status: BookStatus) =>
    ShelfEntry.findOneAndUpdate({ user: userId, book: bookId }, { status }, { new: true }).populate('book'),

  remove: (userId: string, bookId: string) => ShelfEntry.findOneAndDelete({ user: userId, book: bookId }),
};

export type ShelfEntryDocument = Awaited<ReturnType<typeof shelfRepository.upsertEntry>>;
