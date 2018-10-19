import HttpStatus from 'http-status-codes';
import mime from 'mime-types';
import * as UserService from '../../services/user.service';
import * as FileService from '../../services/file.service';
import { ForbidenError, ValidationError } from '../../errors';
import bcrypt from 'bcrypt';
import * as Enum from '../../config/enum';

/**
 * Get user information
 *
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
export async function index(req, res) {
  const users = await UserService.getList(req);
  const total = await UserService.countByFitter(req);
  return res
    .status(HttpStatus.OK)
    .json({
      error: false,
      data: {
        users,
        total
      }
    });
}

/**
 * Get user information
 *
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
export async function getUser(req, res) {

  let currentUser = req.currentUser.toJSON();

  return res
    .status(HttpStatus.OK)
    .json({
      error: false,
      data: {user: currentUser}
    });
}

/**
 * Get info user
 * @param {Object} req
 * @param {Object} res
 * @returns {Promise<*>}
 */
export async function show(req, res) {
  const user = await UserService.findById(req.params.id);
  if (!user) {
    throw new ForbidenError('Not found user');
  }
  return res
    .status(HttpStatus.OK)
    .json({
      error: false,
      data: user.toJSON()
    });
}

/**
 * update user
 * @param {Object} req
 * @param {Object} res
 * @returns {Promise<*>}
 */
export async function update(req, res) {
  const { currentUser } = req;
  const {name, email, password, is_admin, company, change_password_enforcement, password_expired_days} = req.body;
  const user = await UserService.findById(req.params.id);
  if (!user) {
    throw new ForbidenError('Not found user');
  }

  let changePasswordEnforcement = user.get('change_password_enforcement');
  if (change_password_enforcement) {
    changePasswordEnforcement = change_password_enforcement === 'true';
  }
  if (email !== user.get('email') && await UserService.findByEmail(email)) {
    throw new ValidationError('The given data was invalid', {
      email: ['this_email_has_alredy_existed']
    });
  }
  const isAdmin = is_admin === 'true';
  let data = {
    name: name || user.get('name'),
    email: email || user.get('email'),
    is_admin: isAdmin,
    company: company || user.get('company'),
    change_password_enforcement: changePasswordEnforcement,
    password_expired_days: password_expired_days || user.get('password_expired_days')
  };
  if (password) {
    data.password = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUNDS) || 10);
  }
  if (req.files && req.files[0]) {
    const file = req.files[0];
    if (['png', 'jpg', 'jpeg'].indexOf(mime.extension(file.mimetype)) < 0) {
      throw new ForbidenError('Image type is not supported, please use img ipgs, png type to upload.');
    }
    file.ACL = Enum.FILE_ACLS.public;
    const fileObj = await FileService.upload(currentUser.id, file, '');
    const savedFile = await FileService.save(fileObj);
    data.profile_image_id = savedFile.id;
  }
  const updatedUser = await UserService.update(user.id, data);
  if (!updatedUser) {
    throw new ForbidenError('Cannot update user');
  }
  return res
    .status(HttpStatus.OK)
    .json({
      error: false,
      data: user.toJSON()
    });
}

/**
 * Create user
 * @param {Object} req
 * @param {Object} res
 * @returns {Promise<*>}
 */
export async function store(req, res) {
  const {currentUser} = req;
  const {name, email, password, is_admin, company, change_password_enforcement, password_expired_days} = req.body;
  const changePasswordEnforcement = change_password_enforcement === 'true';
  const isAdmin = is_admin === 'true';
  if (await UserService.findByEmail(email)) {
    throw new ValidationError('The given data was invalid', {
      email: ['this_email_has_alredy_existed']
    });
  }
  let data = {
    name: name,
    email: email,
    password: bcrypt.hashSync(password, parseInt(process.env.SALT_ROUNDS) || 10),
    is_admin: isAdmin,
    company: company,
    change_password_enforcement: changePasswordEnforcement,
    password_expired_days: parseInt(password_expired_days) || 0
  };
  if (req.files && req.files[0]) {
    const file = req.files[0];
    if (['png', 'jpg', 'jpeg'].indexOf(mime.extension(file.mimetype)) < 0) {
      throw new ForbidenError('Image type is not supported, please use img ipgs, png type to upload.');
    }
    file.ACL = Enum.FILE_ACLS.public;
    const fileObj = await FileService.upload(currentUser.id, file, '');
    const savedFile = await FileService.save(fileObj);
    data.profile_image_id = savedFile.id;
  }
  const createUser = await UserService.create(data, {});
  if (!createUser) {
    throw new ForbidenError('Cannot create user');
  }
  return res
    .status(HttpStatus.OK)
    .json({
      error: false,
      data: createUser.toJSON()
    });
}

/**
 * Revoke (Update status to false)
 * @param {Object} req
 * @param {Object} res
 * @
 */
export async function revoke(req, res) {
  const user = await UserService.findById(req.params.id);
  if (!user) {
    throw new ForbidenError('Not found user');
  }
  user.status = 0;
  await user.save();
  return res
    .status(HttpStatus.OK)
    .json({
      error: false,
      data: user
    });
}

/**
 * Revoke (Update status to true)
 * @param {Object} req
 * @param {Object} res
 * @
 */
export async function unrevoke(req, res) {
  const user = await UserService.findById(req.params.id);
  if (!user) {
    throw new ForbidenError('Not found user');
  }
  user.status = true;
  await user.save();
  return res
    .status(HttpStatus.OK)
    .json({
      error: false,
      data: user
    });
}

/**
 * Delete list users
 * 
 * @param {Object} req
 * @param {Object} res
 * @
 */
export async function destroys(req, res) {
  const { users } = req.body;
  if (!users) {
    throw new ForbidenError('Not found user');
  }
  await UserService.destroy(users);
  return res
    .status(HttpStatus.OK)
    .json({
      error: false
    });
}
