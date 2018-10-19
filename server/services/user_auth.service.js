import UserModel from '../models/user.model';
import PasswordResetModel from '../models/password_reset.model';
import bcrypt from 'bcrypt';
import MailService from './mail.service';
import {randString} from '../utils/helper';

exports.getUsers = function (){
  return UserModel.fetchAll().then((data) => {
    return data.length > 0 ? data.serialize() : []
  }).catch((err) => console.log(err))
}

exports.login = async function (email, password) {
  const user = await UserModel.findOne({
    where: {
      email: email,
      status: true
    }
  });
  if (user && bcrypt.compareSync(password, user.get('password'))) {
    return user;
  }
  return false;
}

exports.forgotPassword = async function (email, url) {
  const user = await UserModel.findOne({
    where: {
      email: email
    }
  });
  if (user) {
    const token = randString(80);
    await PasswordResetModel.create({
      user_id: user.get('id'),
      token: token
    });
    const emailForgotPassword = {
      username: user.get('first_name') + ' ' + user.get('last_name'),
      link : url + 'reset-password/' + token
    };
    MailService.sendMail(user.get('email'), 'email_forgot_password', emailForgotPassword);
    return true;
  }
  return false;
}

exports.getUserIdByTokenResetPassword = async function (token) {
  return await PasswordResetModel.findOne({where: { token: token}});
}

exports.deleteTokenResetPassword = function (token) {
  PasswordResetModel.destroy({where: { token: token}});
}
