import express from 'express';
import adminRoutes from './admin';
import v1Routes from './v1';

const router = express.Router();

// mount auth routes at /admin
router.use('/admin', adminRoutes);

// mount user routes at /users
router.use('/v1', v1Routes);

export default router;
