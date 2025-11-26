import swaggerJSDoc from 'swagger-jsdoc';
import env from '../config/env';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Bookshelf API',
    version: '1.0.0',
    description: 'API para gestão da prateleira virtual de livros',
  },
  servers: [{ url: `http://localhost:${env.port}`, description: 'Local' }],
  tags: [
    { name: 'Auth', description: 'Cadastro e login' },
    { name: 'Books', description: 'Catálogo de livros' },
    { name: 'Shelf', description: 'Prateleira do usuário' },
  ],
  security: [{ bearerAuth: [] }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

const swaggerSpec: any = swaggerJSDoc({
  definition: swaggerDefinition,
  apis: ['src/routes/**/*.ts', 'src/models/**/*.ts'],
});

const securedPaths = ['/api/books', '/api/books/{id}', '/api/shelf', '/api/shelf/{bookId}'];

securedPaths.forEach((path) => {
  const operations = swaggerSpec.paths?.[path];
  if (!operations) return;

  Object.keys(operations).forEach((method) => {
    const op = operations[method as keyof typeof operations];
    if (op) {
      op.security = swaggerDefinition.security;
    }
  });
});

swaggerSpec.security = swaggerDefinition.security;

export default swaggerSpec;
