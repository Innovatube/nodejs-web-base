import express from 'express';
import validate from '../../config/validate';
import adminValidator from '../../utils/admin.validator';
import * as authCtrl from '../../controllers/admin/auth.controller';

const router = express.Router();

router.route('/login').post(validate(adminValidator.login), (req, res, next) => {
  authCtrl.login(req, res).catch(next);
});

export default router;
