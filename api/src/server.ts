import fs from 'fs';
import app from './app';
import { connectDatabase } from './config/database';
import env from './config/env';

const start = async () => {
  try {
    await connectDatabase();
    fs.mkdirSync(env.uploadDir, { recursive: true });

    app.listen(env.port, () => {
      // eslint-disable-next-line no-console
      console.log(`API running on port ${env.port}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

void start();
