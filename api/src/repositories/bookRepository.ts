import { FilterQuery, Types } from 'mongoose';
import Book, { IBook } from '../models/Book';

export const bookRepository = {
  create: (data: Pick<IBook, 'title' | 'author' | 'description' | 'coverImageUrl' | 'createdBy'>) =>
    Book.create(data),
  list: (search?: string, sort: 'date' | 'title' | 'rating' = 'date', userId?: string) => {
    const filter: FilterQuery<IBook> =
      search && search.trim().length
        ? {
            $or: [
              { title: { $regex: search, $options: 'i' } },
              { author: { $regex: search, $options: 'i' } },
            ],
          }
        : {};
    const sortStage: Record<string, 1 | -1> =
      sort === 'title'
        ? { title: 1 }
        : sort === 'rating'
        ? { ratingAvg: -1, ratingCount: -1, createdAt: -1 }
        : { createdAt: -1 };

    const pipeline: any[] = [
      { $match: filter },
      {
        $addFields: {
          ratingCount: { $size: { $ifNull: ['$ratings', []] } },
          ratingAvg: { $cond: [{ $gt: [{ $size: { $ifNull: ['$ratings', []] } }, 0] }, { $avg: '$ratings.score' }, 0] },
        },
      },
    ];

    if (userId) {
      pipeline.push(
        {
          $lookup: {
            from: 'shelfentries',
            let: { bookId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: { $and: [{ $eq: ['$book', '$$bookId'] }, { $eq: ['$user', new Types.ObjectId(userId)] }] },
                },
              },
              { $limit: 1 },
            ],
            as: 'shelfEntry',
          },
        },
        { $addFields: { inShelf: { $gt: [{ $size: '$shelfEntry' }, 0] } } },
        { $project: { shelfEntry: 0 } }
      );
    }

    pipeline.push({ $sort: sortStage });

    return Book.aggregate(pipeline);
  },
  getById: (id: string, userId?: string) => {
    const pipeline: any[] = [
      { $match: { _id: new Types.ObjectId(id) } },
      {
        $addFields: {
          ratingCount: { $size: { $ifNull: ['$ratings', []] } },
          ratingAvg: { $cond: [{ $gt: [{ $size: { $ifNull: ['$ratings', []] } }, 0] }, { $avg: '$ratings.score' }, 0] },
        },
      },
    ];

    if (userId) {
      pipeline.push(
        {
          $addFields: {
            userRating: {
              $let: {
                vars: {
                  match: {
                    $filter: {
                      input: { $ifNull: ['$ratings', []] },
                      as: 'r',
                      cond: { $eq: ['$$r.user', new Types.ObjectId(userId)] },
                    },
                  },
                },
                in: {
                  $cond: [
                    { $gt: [{ $size: '$$match' }, 0] },
                    {
                      $let: {
                        vars: { first: { $arrayElemAt: ['$$match', 0] } },
                        in: '$$first.score',
                      },
                    },
                    null,
                  ],
                },
              },
            },
          },
        },
        {
          $lookup: {
            from: 'shelfentries',
            let: { bookId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: { $and: [{ $eq: ['$book', '$$bookId'] }, { $eq: ['$user', new Types.ObjectId(userId)] }] },
                },
              },
              { $limit: 1 },
            ],
            as: 'shelfEntry',
          },
        },
        { $addFields: { inShelf: { $gt: [{ $size: '$shelfEntry' }, 0] } } },
        { $project: { shelfEntry: 0 } }
      );
    }

    pipeline.push({ $limit: 1 });

    return Book.aggregate(pipeline);
  },
  rate: async (bookId: string, userId: string, score: number) => {
    const book = await Book.findById(bookId);
    if (!book) return null;
    const existing = book.ratings?.find((r) => r.user.toString() === userId);
    if (existing) {
      existing.score = score;
    } else {
      book.ratings = [...(book.ratings || []), { user: userId as any, score }];
    }
    await book.save();
    const avg = book.ratings?.length ? book.ratings.reduce((a, b) => a + b.score, 0) / book.ratings.length : 0;
    return { book, ratingAvg: avg, ratingCount: book.ratings?.length || 0 };
  },
};

export type BookDocument = Awaited<ReturnType<typeof bookRepository.create>>;
