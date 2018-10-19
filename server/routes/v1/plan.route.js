import express from 'express';
import * as planController from '../../controllers/v1/plan.controller';
import validate from "../../config/validate";
import planValidator from "../../utils/plan.validator";

const router = express.Router();

router
  .route('/')
  .put(validate(planValidator.create), (req, res, next) => {
    planController.create(req, res).catch(next)
  });

export default router;


