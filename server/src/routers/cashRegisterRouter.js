import express from 'express';
import { getTables, getProducts, deleteProduct } from '../controllers/cashRegisterController.js';
import authMiddleware from '../middleware/cashRegisterAuth.js';

const router = express.Router();

router.use(authMiddleware);
router.get('/tables', getTables);
router.get('/products', getProducts);
router.delete('/products/:productId', deleteProduct);

export default router; 