import HttpStatus from 'http-status-codes';
import mime from 'mime-types';
import * as Enum from '../../config/enum';
import * as UserService from '../../services/user.service';
import * as FileService from '../../services/file.service';
import { NotFound, ValidationError, ForbidenError } from '../../errors';
import moment from "moment";

/**
 * Update user information
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export async function updateUser(req, res) {
  const {first_name, last_name, email} = req.body;

  let currentUser = req.currentUser;
  let user = await UserService.findById(currentUser.get('id'));

  if (!user) {
    throw new NotFound('User not found');
  }

  let data = {
    first_name: first_name || user.get('firstName'),
    last_name: last_name || user.get('lastName'),
    email: email || user.get('email')
  };

  let updatedUser = await UserService.update(user.id, data);

  if (!updatedUser) {
    throw new Error('Cannot update user');
  }

  return res
    .status(HttpStatus.OK)
    .json({
      error: false
    })
}


/**
 * Get user information
 *
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
export async function getUser(req, res) {

  let currentUser = req.currentUser;
  const user = await UserService.findById(currentUser.get('id'));
  return res
    .status(HttpStatus.OK)
    .json({
      error: false,
      data: {user}
    });
}

/**
 * Change password
 *
 * @param req
 * @param res
 */
export async function changePassword(req, res) {
  let currentUser = req.currentUser;
  let body = req.body;
  let currentPassword = body.current_password;
  let newPassword = body.new_password;

  if (!UserService.comparePassword(currentPassword, currentUser.password)) {
    throw new ValidationError('Reset password successfully', {
      current_password: ['current_password_is_worng']
    });
  }

  await UserService.updatePasswordById(currentUser.id, newPassword);

  return res.json({
    error: false,
    message: 'Change password success'
  })
}

/**
 * Force user change password
 *
 * @param req
 * @param res
 */
export async function forceChangePassword(req, res) {
  let currentUser = req.currentUser;
  let body = req.body;
  let newPassword = body.password;

  await UserService.updatePasswordById(currentUser.id, newPassword);
  let user = await UserService.findById(currentUser.id);

  if (UserService.comparePassword(newPassword, currentUser.password)) {
    throw new ValidationError('Reset password successfully', {
      password: ['Password must be different from your previous password']
    });
  }

  let timeRequiredChangePassword = moment(user.password_updated_at)
    .add(user.password_expired_days, 'days')
    .unix();

  return res.json({
    error: false,
    data: {
      time_need_change_password: timeRequiredChangePassword,
      change_password_enforcement: user.change_password_enforcement
    },
    message: 'Change password success'
  })
}

/**
 * Upload image and save to avatar user
 * @param {Object} req
 * @param {Object} res
 * @returns {Promise<*>}
 */
export async function uploadAvatar(req, res) {
  const { currentUser } = req;
  const file = req.files[0];
  if (!file) {
    throw new ForbidenError('Can not upload file.');
  }
  if (['png', 'jpg', 'jpeg'].indexOf(mime.extension(file.mimetype)) < 0) {
    throw new ForbidenError('Image type is not supported, please use img ipgs, png type to upload.');
  }
  file.ACL = Enum.FILE_ACLS.public;
  const fileObj = await FileService.upload(currentUser.get('id'), file, '');
  const savedFile = await FileService.save(fileObj);
  const updatedUser = await UserService.update(currentUser.get('id'), {profile_image_id: savedFile.id});
  if (!updatedUser) {
    throw new ForbidenError('Cannot update user');
  }
  const user = await UserService.findById(currentUser.get('id'));
  return res
    .status(HttpStatus.OK)
    .json({
      error: false,
      data: {user},
      message: 'Upload avatar successful.',
    });
}
