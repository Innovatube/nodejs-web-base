import UserModel from '../models/user.model';
import bcrypt from 'bcrypt';
import {ForbidenError} from '../errors';

exports.login = async function (email, password) {
  const adminUser = await UserModel.findOne({
    where: {
      email: email
    }
  });
  if (adminUser && bcrypt.compareSync(password, adminUser.get('password'))) {
    if (adminUser.get('status') !== true) {
      throw new ForbidenError('User has been banned');
    }
    if (adminUser.get('is_admin') !== true) {
      throw new ForbidenError('User not admin');
    }
    return adminUser;
  }
  return false;
}
