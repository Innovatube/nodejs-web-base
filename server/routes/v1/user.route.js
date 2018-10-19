import express from 'express';
import * as userController from '../../controllers/v1/user.controller';
import validate from "../../config/validate";
import userValidator from "../../utils/user.validator";

const router = express.Router();

router
  .route('/')
  .get((req, res, next) => {
    userController.getUser(req, res).catch(next)
  });

router
  .route('/')
  .put(validate(userValidator.updateUser), (req, res, next) => {
    userController.updateUser(req, res).catch(next)
  });

router
  .route('/change-password')
  .put(validate(userValidator.changePassword), (req, res, next) => {
    userController.changePassword(req, res).catch(next)
  });

router
  .route('/force-change-password')
  .put(validate(userValidator.forceChangePassword), (req, res, next) => {
    userController.forceChangePassword(req, res).catch(next)
  });

router
  .route('/change-avatar')
  .post((req, res, next) => {
    userController.uploadAvatar(req, res).catch(next)
  });

export default router;


