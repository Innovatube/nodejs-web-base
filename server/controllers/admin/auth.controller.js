import HttpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';
import AdminAuthService from '../../services/admin_auth.service';
import {ForbidenError} from '../../errors';
/**
 * Returns jwt token if valid email and password is provided
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export async function login (req, res) {
  const {email, password} = req.body;
  const adminUser = await AdminAuthService.login(email, password);
  if (adminUser) {
    const token = jwt.sign({
      id: adminUser.get('id'),
      email: adminUser.get('email'),
      is_admin: adminUser.get('is_admin')
    }, process.env.TOKEN_SECRET_KEY);
    return res.status(HttpStatus.OK).json({token, email: adminUser.get('email'), is_admin: adminUser.get('is_admin')});
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
export function forgotPassword () {
  const {email} = req.body;
}
