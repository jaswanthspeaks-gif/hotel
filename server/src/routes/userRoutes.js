import { Router } from 'express';
import { body, param } from 'express-validator';
import { listUsers, updateUserRole, deleteUser } from '../controllers/userController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = Router();

router.get('/', protect, adminOnly, listUsers);
router.patch(
  '/:id/role',
  protect,
  adminOnly,
  param('id').isMongoId(),
  [body('role').isIn(['user', 'admin'])],
  validateRequest,
  updateUserRole
);
router.delete('/:id', protect, adminOnly, param('id').isMongoId(), validateRequest, deleteUser);

export default router;
