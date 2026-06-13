import express from 'express';
import {
  getCart,
  addToCart,
  removeFromCart,
  updateCartQuantity,
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Secure all cart routes

router.route('/')
  .get(getCart);

router.route('/add')
  .post(addToCart);

router.route('/remove/:id')
  .delete(removeFromCart);

router.route('/update')
  .put(updateCartQuantity);

export default router;
