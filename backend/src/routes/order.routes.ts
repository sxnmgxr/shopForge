import { Router } from 'express';
import { createOrder, getMyOrders, getOrder } from '../controllers/order.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
router.post('/',    authenticate, createOrder);
router.get('/',     authenticate, getMyOrders);
router.get('/:id',  authenticate, getOrder);
export default router;
