import HttpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';
import * as UserService from '../services/user.service';
import moment from 'moment';
import { ForbidenError, NotFound, Unauthorized } from '../errors';

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
          throw new Unauthorized('You are not authorized to perform this operation!');
        } else {
          UserService.findById(decoded.id).then((user) => {
            if (user) {
              req.currentUser = user;
              if (!user.status) {
                throw new Unauthorized('User has been revoked!');
              }
              if (isForceChangePW(user, req)) {
                throw new ForbidenError('Must update password');
              }
              return next();
            }
            throw new NotFound('No such user');
          }).catch(next);
        }
      });
    } else {
      res.status(HttpStatus.FORBIDDEN).json({
        error: 'No token provided'
      });
    }
};

/**
 *  Check if needed to force change pw
 *
 * @return {*|boolean}
 */
function isForceChangePW(user, req) {
  const dayNeedUpdatePassword = moment(user.get('password_updated_at')).add(user.get('password_expired_days'), 'days');

  const allowUrl = [
    '/api/v1/user/force-change-password',
    '/api/v1/user/change-password'
  ];

  return user.get('change_password_enforcement')
    && user.get('password_expired_days') > 0
    && moment().isAfter(dayNeedUpdatePassword)
    && allowUrl.indexOf(req.originalUrl) === -1;
}