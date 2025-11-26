import { Schema, Types, model } from 'mongoose';

export const BOOK_STATUSES = ['not_started', 'reading', 'finished'] as const;
export type BookStatus = (typeof BOOK_STATUSES)[number];
export const isValidBookStatus = (status: unknown): status is BookStatus =>
  typeof status === 'string' && (BOOK_STATUSES as readonly string[]).includes(status);

export interface IShelfEntry {
  user: Types.ObjectId;
  book: Types.ObjectId;
  status: BookStatus;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ShelfEntry:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         status:
 *           type: string
 *           enum: [not_started, reading, finished]
 *         book:
 *           $ref: '#/components/schemas/Book'
 *         updatedAt:
 *           type: string
 */
const shelfEntrySchema = new Schema<IShelfEntry>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    status: { type: String, enum: ['not_started', 'reading', 'finished'], default: 'not_started' },
  },
  { timestamps: true }
);

shelfEntrySchema.index({ user: 1, book: 1 }, { unique: true });

export default model<IShelfEntry>('ShelfEntry', shelfEntrySchema);
