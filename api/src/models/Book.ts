import { Schema, model } from 'mongoose';

export interface IBook {
  title: string;
  author: string;
  description?: string;
  coverImageUrl?: string;
  createdBy?: string;
  ratings?: {
    user: Schema.Types.ObjectId;
    score: number;
  }[];
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         author:
 *           type: string
 *         description:
 *           type: string
 *         coverImageUrl:
 *           type: string
 *         ratingCount:
 *           type: number
 *         ratingAvg:
 *           type: number
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 */
const bookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    coverImageUrl: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    ratings: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        score: { type: Number, min: 0, max: 5, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default model<IBook>('Book', bookSchema);
