import express from 'express';
import * as jobController from '../../controllers/v1/job.controller';
import validate from "../../config/validate";
import jobValidator from "../../utils/job.validator";

const router = express.Router();

router
  .route('/:id')
  .get((req, res, next) => {
    jobController.show(req, res).catch(next);
  });

export default router;


