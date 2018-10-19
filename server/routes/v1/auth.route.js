import express from 'express';
import validate from '../../config/validate';
import * as authController from '../../controllers/v1/auth.controller';
import userValidator from '../../utils/user.validator';
const router = express.Router();
router.route('/login').post(validate(userValidator.login), (req, res, next) => {
  authController.login(req, res).catch(next);
});
router.route('/forgot-password').post(validate(userValidator.forgotPassword), (req, res, next) => {
  authController.forgotPassword(req, res).catch(next);
});
router.route('/reset/password').get((req, res, next) => {
  authController.checkTokenResetPassword(req, res).catch(next);
});
router.route('/reset/password').post(validate(userValidator.resetPasswordByToken), (req, res, next) => {
  authController.resetPasswordByToken(req, res).catch(next);
});

export default router;
