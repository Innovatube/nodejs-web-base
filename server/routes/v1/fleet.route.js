import express from 'express';
import * as FleetController from '../../controllers/v1/fleet.controller';

const router = express.Router();

router
  .route('/')
  .get((req, res, next) => {
    FleetController.getFleet(req, res).catch(next);
  });


export default router;


