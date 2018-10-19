import express from 'express';
import * as StopController from '../../controllers/v1/stop.controller';
import validate from '../../config/validate';
import stopValidator from "../../utils/stop.validator";

const router = express.Router();

router
  .route('/changeSeq')
  .put(validate(stopValidator.changeSeq), (req, res, next) => {
    StopController.changeSequence(req, res).catch(next);
  });

router
  .route('/reset-seq')
  .put(validate(stopValidator.resetSeq), (req, res, next) => {
    StopController.resetSequence(req, res).catch(next);
  });


//TODO change route name to move-served0-to-exist-route
router
  .route('/move')
  .put(validate(stopValidator.moveServedToExistRoute), (req, res, next) => {
    StopController.moveServedToExistRoute(req, res).catch(next);
  });

//TODO change route name to move-unserved-to-exist-route
router
  .route('/add-unserved')
  .put(validate(stopValidator.moveUnServedToExistRoute), (req, res, next) => {
    StopController.moveUnServedToExistRoute(req, res).catch(next);
  });

router
  .route('/move-served-to-new-route')
  .put(validate(stopValidator.moveServeToNewRoute), (req, res, next) => {
    StopController.moveServedToNewRoute(req, res).catch(next);
  });

router
  .route('/')
  .get((req, res, next) => {
    StopController.list(req, res).catch(next);
  });

export default router;


