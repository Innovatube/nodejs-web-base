import express from 'express';
import * as userController from '../../controllers/admin/user.controller';
import validate from "../../config/validate";
import userValidator from "../../utils/user.validator";

const router = express.Router();

router
  .route('/')
  .get((req, res, next) => {
    userController.index(req, res).catch(next)
  });

router
  .route('/')
  .put(validate(userValidator.updateUser), (req, res, next) => {
    userController.updateUser(req, res).catch(next)
  });
router
  .route('/:id')
  .get((req, res, next) => {
    userController.show(req, res).catch(next)
  });
router
  .route('/:id')
  .put(validate(userValidator.update), (req, res, next) => {
    userController.update(req, res).catch(next)
  });
router
  .route('/')
  .post(validate(userValidator.store), (req, res, next) => {
    userController.store(req, res).catch(next)
  });
router
  .route('/:id/revoke')
  .post((req, res, next) => {
    userController.revoke(req, res).catch(next)
  });
router
  .route('/:id/unrevoke')
  .post((req, res, next) => {
    userController.unrevoke(req, res).catch(next)
  });
router
  .route('/')
  .delete((req, res, next) => {
    userController.destroys(req, res).catch(next)
  });

export default router;
