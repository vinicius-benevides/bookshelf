import { Router } from 'express';
import { addToShelf, listShelf, updateShelfStatus, removeFromShelf } from '../controllers/shelfController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/shelf:
 *   get:
 *     summary: Lista a prateleira do usuário
 *     tags: [Shelf]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Itens da prateleira
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ShelfEntry'
 *       401:
 *         description: Não autenticado
 *   post:
 *     summary: Adiciona um livro à prateleira
 *     tags: [Shelf]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [bookId]
 *             properties:
 *               bookId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Livro incluído na prateleira
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShelfEntry'
 *       404:
 *         description: Livro não encontrado
 */
router.get('/', listShelf);
router.post('/', addToShelf);

/**
 * @swagger
 * /api/shelf/{bookId}:
 *   patch:
 *     summary: Atualiza status de leitura
 *     tags: [Shelf]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [not_started, reading, finished]
 *     responses:
 *       200:
 *         description: Status atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShelfEntry'
 *       404:
 *         description: Livro não está na prateleira
 *   delete:
 *     summary: Remove um livro da prateleira
 *     tags: [Shelf]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Livro removido da prateleira
 *       404:
 *         description: Livro não está na prateleira
 */
router.patch('/:bookId', updateShelfStatus);
router.delete('/:bookId', removeFromShelf);

export default router;
