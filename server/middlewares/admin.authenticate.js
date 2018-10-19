import HttpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';
import * as UserService from '../services/user.service';
import moment from 'moment';
import { ForbidenError, NotFound } from '../errors';

/**
 * Route authentication middleware to verify a token
 *
 * @param {object} req
 * @param {object} res
 * @param {function} next
 *
 */

export default (req, res, next) => {
  const authorizationHeader = req.headers['authorization'];
  let token;

  if (authorizationHeader) {
    token = authorizationHeader.split(' ')[1];
  }

  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
      if (err) {
        res.status(HttpStatus.UNAUTHORIZED).json({error: 'You are not authorized to perform this operation!'});
      } else {
        UserService.findById(decoded.id).then((adminUser) => {
          if (adminUser){
            req.currentUser = adminUser;
            if (adminUser.get('status') !== true) {
              return res.status(HttpStatus.UNAUTHORIZED).json({error: 'User has been banned'});
            }
            if (adminUser.get('is_admin') !== true) {
              return res.status(HttpStatus.UNAUTHORIZED).json({error: 'User not admin'});
            }
            const dayNeedUpdatePassword = moment(adminUser.get('password_updated_at')).add(adminUser.get('password_expired_days'), 'days');
            if (adminUser.get('change_password_enforcement')
                && adminUser.get('password_expired_days') > 0
                && moment().isAfter(dayNeedUpdatePassword)
            ) {
              throw new ForbidenError('Must update password');
            }
            return next();
          }
          throw new NotFound('No such user');
        }).catch(next);
      }
    });
  } else {
    res.status(HttpStatus.UNAUTHORIZED).json({
      error: 'No token provided'
    });
  }
};