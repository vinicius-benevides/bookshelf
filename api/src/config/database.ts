import mongoose from 'mongoose';
import env from './env';

mongoose.set('strictQuery', true);

export const connectDatabase = async (): Promise<void> => {
  await mongoose.connect(env.mongoUri);
  // eslint-disable-next-line no-console
  console.log('Connected to MongoDB');
};
