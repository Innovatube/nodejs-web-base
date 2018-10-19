import express from 'express';
import * as vehicleController from '../../controllers/v1/vehicle.controller';
import validate from "../../config/validate";
import vehicleValidator from "../../utils/vehicle.validator";
import {moveUnServedToNewRoute} from "../../controllers/v1/stop.controller";

const router = express.Router();

//TODO change route name to move-unserved-to-new-route and move to stops constroller
router
  .route('/')
  .put(validate(vehicleValidator.moveUnServedToNewRoute), (req, res, next) => {
    moveUnServedToNewRoute(req, res).catch(next)
  });

router
  .route('/')
  .get((req, res, next) => {
    vehicleController.list(req, res).catch(next)
  });

export default router;


