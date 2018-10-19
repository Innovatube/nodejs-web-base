import express from 'express';
import authRoutes from './auth.route';
import userRoutes from './user.route';
import doashBoardRoutes from './doash_board.route';
import adminAuthenticate from '../../middlewares/admin.authenticate';

const router = express.Router();

// mount auth routes at /auth
router.use('/auth', authRoutes);
router.use('/users', adminAuthenticate, userRoutes);
router.use('/doash-board', adminAuthenticate, doashBoardRoutes);

export default router;
