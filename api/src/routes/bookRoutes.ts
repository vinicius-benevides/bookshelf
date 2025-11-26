import { Router } from 'express';
import upload from '../config/storage';
import { createBook, getBookById, listBooks, rateBook } from '../controllers/bookController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Lista ou pesquisa livros
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Termo de busca
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [date, title, rating]
 *         description: Ordenação (data, título ou relevância de avaliação)
 *     responses:
 *       200:
 *         description: Lista de livros
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *   post:
 *     summary: Cadastra um novo livro
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, author]
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               description:
 *                 type: string
 *               cover:
 *                 type: string
 *                 format: binary
 *               coverUrl:
 *                 type: string
 *                 description: URL de uma imagem já hospedada (opcional)
 *     responses:
 *       201:
 *         description: Livro criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       401:
 *         description: Não autenticado
 */
router.get('/', listBooks);
router.post('/', authenticate, upload.single('cover'), createBook);

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Busca livro por id
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Livro encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Livro não encontrado
 */
router.get('/:id', getBookById);

/**
 * @swagger
 * /api/books/{id}/rating:
 *   patch:
 *     summary: Avalia um livro
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [score]
 *             properties:
 *               score:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 5
 *     responses:
 *       200:
 *         description: Avaliação registrada
 *       404:
 *         description: Livro não encontrado
 */
router.patch('/:id/rating', rateBook);

export default router;
