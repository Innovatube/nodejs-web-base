import express from 'express';
import * as doashBoardController from '../../controllers/admin/doash_board.controller';

const router = express.Router();

router
  .route('/')
  .get((req, res, next) => {
    doashBoardController.index(req, res).catch(next)
  });

export default router;
