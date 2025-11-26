import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const env = {
  port: Number(process.env.PORT) || 3333,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/bookshelf',
  jwtSecret: process.env.JWT_SECRET || 'changeme-super-secret',
  uploadDir: path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'uploads'),
  swaggerPublicUrl: process.env.SWAGGER_PUBLIC_URL,
};

export default env;
