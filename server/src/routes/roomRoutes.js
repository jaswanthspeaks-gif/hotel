import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  listRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
  adminListRooms,
} from '../controllers/roomController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = Router();

const roomValidators = [
  body('roomNumber').trim().notEmpty(),
  body('title').trim().notEmpty(),
  body('type').trim().notEmpty(),
  body('pricePerNight').isFloat({ min: 0 }),
  body('destination').optional().trim(),
  body('location').optional().trim(),
  body('description').optional().trim(),
  body('imageUrl').optional().trim(),
  body('maxGuests').optional().isInt({ min: 1 }),
  body('isActive').optional().isBoolean(),
];

const roomUpdateValidators = [
  body('roomNumber').optional().trim().notEmpty(),
  body('title').optional().trim().notEmpty(),
  body('type').optional().trim().notEmpty(),
  body('pricePerNight').optional().isFloat({ min: 0 }),
  body('destination').optional().trim(),
  body('location').optional().trim(),
  body('description').optional().trim(),
  body('imageUrl').optional().trim(),
  body('maxGuests').optional().isInt({ min: 1 }),
  body('isActive').optional().isBoolean(),
];

router.get('/', listRooms);
router.get('/admin/all', protect, adminOnly, adminListRooms);
router.get('/:id', param('id').isMongoId().withMessage('Invalid room id'), validateRequest, getRoom);
router.post('/', protect, adminOnly, roomValidators, validateRequest, createRoom);
router.put(
  '/:id',
  protect,
  adminOnly,
  param('id').isMongoId(),
  roomUpdateValidators,
  validateRequest,
  updateRoom
);
router.delete('/:id', protect, adminOnly, param('id').isMongoId(), validateRequest, deleteRoom);

export default router;
