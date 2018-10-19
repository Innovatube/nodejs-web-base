import HttpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import UserAuthService from '../../services/user_auth.service';
import * as UserService from '../../services/user.service';
import { updatePasswordById  } from '../../services/user.service';
import {ForbidenError, ValidationError} from '../../errors';

/**
 * Returns jwt token if valid email and password is provided
 *
 * @param {object} req
 * @param {object} res
 * @returns {Promise<void>}
 */
export async function login(req, res) {
  const {email, password} = req.body;
  const user = await UserAuthService.login(email, password);
  if (user) {
    let timeRequiredChangePassword = 0;
    if (user.get('change_password_enforcement') && user.get('password_expired_days') > 0) {
      timeRequiredChangePassword = moment(user.get('password_updated_at') || user.created_at)
        .add(user.get('password_expired_days'), 'days').unix();
    }
    const token = jwt.sign({id: user.get('id'), email: user.get('email'), is_admin: user.get('is_admin')}, process.env.TOKEN_SECRET_KEY);
    return res.status(HttpStatus.OK).json({
      token: token,
      email: user.get('email'),
      is_admin: user.get('is_admin'),
      time_need_change_password: timeRequiredChangePassword,
      change_password_enforcement: user.get('change_password_enforcement')
    });
  }
  throw new ForbidenError('Invalid email or password.');
}

/**
 * Returns bool and send link forgot password to email
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export async function forgotPassword (req, res) {
  const {email} = req.body;

  let user = await UserService.findByEmail(email);
  if (!user) {
    throw new ValidationError('The given data was invalid', {
      email: ['Email is not available, please re-entry!']
    })
  }

  await UserAuthService.forgotPassword(email, req.baseUrlLive);

  return res.status(HttpStatus.OK).json({
    error: false, message: 'Success'
  });
}

/**
 * Check token reset password
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export async function checkTokenResetPassword (req, res) {
  const tokenAvailable = await UserAuthService.getUserIdByTokenResetPassword(req.query.token);
  if (!tokenAvailable) {
    throw new ForbidenError('No token to resset password');
  }
  return res.status(HttpStatus.OK).json({
    error: false, message: 'Success'
  });
}
/**
 * Reset password by token
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export async function resetPasswordByToken (req, res) {
  const {token, password} = req.body;
  const tokenAvailable = await UserAuthService.getUserIdByTokenResetPassword(token);
  if (tokenAvailable) {
    const updated = await updatePasswordById(tokenAvailable.get('user_id'), password);
    if (updated) {
      UserAuthService.deleteTokenResetPassword(token);
      return  res.status(HttpStatus.OK).json({
        error: false
      });
    }
  }
  throw new ForbidenError('Can not found this token.');
}

