import express from 'express';
import * as logisticsController from '../../controllers/v1/logistics.controller';
import validate from '../../config/validate';
import logisticsValidator from '../../utils/logistics.validator';

const router = express.Router();

router
  .route('/upload')
  .post(validate(logisticsValidator.upload), (req, res, next) => {
    logisticsController.upload(req, res).catch(next)
  });


router
  .route('/create-job')
  .post(validate(logisticsValidator.createJob), (req, res, next) => {
    logisticsController.createJob(req, res).catch(next);
  });

router
  .route('/re-routes')
  .put(validate(logisticsValidator.reRoutes), (req, res, next) => {
    logisticsController.reRoutes(req, res).catch(next);
  });

router
  .route('/get-status')
  .post(validate(logisticsValidator.getStatus), (req, res, next) => {
    logisticsController.getStatus(req, res).catch(next);
  });

router
  .route('/cancel-task')
  .post(validate(logisticsValidator.cancelTask), (req, res, next) => {
    logisticsController.cancelTask(req, res).catch(next);
  });

router
  .route('/download-report/:id')
  .get( (req, res, next) => {
    logisticsController.createDetailReport(req, res).catch(next);
  });
router
  .route('/download-export-master-plan/:id')
  .get( (req, res, next) => {
    logisticsController.createMasterPlanReport(req, res).catch(next);
  });

export default router;
