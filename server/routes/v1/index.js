import express from 'express';
import authRoutes from './auth.route';
import userRoutes from './user.route';
import logisticsRoutes from './logistics.route';
import fleetRoutes from './fleet.route';
import stopRoutes from './stop.route';
import vehicleRoutes from './vehicle.route';
import jobRoutes from './job.route';
import userAuthenticate from '../../middlewares/user.authenticate';


const router = express.Router();

// mount auth routes at /auth
router.use('/auth', authRoutes);
router.use('/user', userAuthenticate, userRoutes);
router.use('/logistics', userAuthenticate, logisticsRoutes);
router.use('/fleet', userAuthenticate, fleetRoutes);
router.use('/stop', userAuthenticate, stopRoutes);
router.use('/stop', userAuthenticate, stopRoutes);
router.use('/vehicle', userAuthenticate, vehicleRoutes);
router.use('/job', userAuthenticate, jobRoutes);

export default router;
