import { Router } from 'express';
import {
  getProducts, getProduct, getProductBySlug,
  createProduct, updateProduct
} from '../controllers/product.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();
router.get('/',           getProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id',        getProduct);
router.post('/',          authenticate, requireAdmin, createProduct);
router.put('/:id',        authenticate, requireAdmin, updateProduct);
export default router;
