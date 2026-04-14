import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  createBooking,
  myBookings,
  cancelMyBooking,
  adminListBookings,
  adminUpdateBookingStatus,
  adminDeleteBooking,
} from '../controllers/bookingController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = Router();

router.post(
  '/',
  protect,
  [
    body('roomId').isMongoId(),
    body('checkIn').isISO8601(),
    body('checkOut').isISO8601(),
    body('guests').optional().isInt({ min: 1 }),
    body('promoCode').optional().trim(),
  ],
  validateRequest,
  createBooking
);

router.get('/mine', protect, myBookings);
router.patch('/mine/:id/cancel', protect, param('id').isMongoId(), validateRequest, cancelMyBooking);

router.get('/admin/all', protect, adminOnly, adminListBookings);
router.patch(
  '/admin/:id/status',
  protect,
  adminOnly,
  param('id').isMongoId(),
  [body('status').isIn(['pending', 'confirmed', 'cancelled'])],
  validateRequest,
  adminUpdateBookingStatus
);
router.delete('/admin/:id', protect, adminOnly, param('id').isMongoId(), validateRequest, adminDeleteBooking);

export default router;
