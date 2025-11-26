import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import env from './config/env';
import routes from './routes';
import swaggerSpec from './docs/swagger';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(env.uploadDir));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.path} not found` });
});

export default app;
