import Sequelize from 'sequelize';
import mime from 'mime-types';
import FileModel from '../models/file.model';
import Excel from '../utils/excel/XlsxPopulate';
import {ForbidenError} from '../errors';
import path from 'path';
import fs from 'fs';
import * as Enum from '../config/enum';
import {S3} from '../config/aws';
import logger from '../config/winston';
import * as VehicleService from '../services/vehicle.service';

const Op = Sequelize.Op;

/**
 * Upload file 
 * 
 * @param {Number} userId
 * @param {Object} file
 * @param {String} templateType
 * @param {String} ACL
 * @returns {Object}
 */
export function upload(userId, file, templateType) {
  const { FILE_STORAGE_TYPE } = Enum;
  file.ACL = (file.ACL === Enum.FILE_ACLS.public) ? Enum.FILE_ACLS.public : Enum.FILE_ACLS.private;
  file.mimetype = (file.mimetype === 'application/octet-stream' ) ? mime.lookup(file.originalname) : file.mimetype;
  return (process.env.STORAGE_TYPE === FILE_STORAGE_TYPE.local)
    ? this.createLocalFileObj(userId, file, templateType)
    : this.fileUploadS3(userId, file, templateType)
}


/**
 * Create file object with storage type is local
 *
 * @param userId
 * @param file
 * @param templateType
 * @return {{url: string, storage_type: string, file_type: string, media_type, format, original_file_name, file_size, thumbnails: string, user_id: *, template_type: *}}
 */
export async function fileUploadS3(userId, file, templateType) {
  const fileStream = fs.readFileSync(path.join(__dirname, '../../uploads/' + file.filename));
  const params = {
    Bucket: process.env.AWS_IMAGE_BUCKET,
    Key: file.filename,
    ACL: file.ACL,
    CacheControl: file.cacheControl,
    ContentType: file.contentType,
    Metadata: file.metadata,
    StorageClass: file.storageClass,
    ServerSideEncryption: file.serverSideEncryption,
    Body: fileStream
  };
  try{
    const fileS3 = await S3.upload(params).promise();
    this.removeFromLocal(path.join(__dirname, '../../uploads/' + file.filename));
    return {
      url: fileS3.Location,
      s3_key: fileS3.key,
      s3_bucket: fileS3.Bucket,
      s3_region: process.env.AWS_IMAGE_BUCKET,
      storage_type: Enum.FILE_STORAGE_TYPE.s3,
      file_type: mime.extension(file.mimetype),
      media_type: file.mimetype,
      format: file.mimetype,
      original_file_name: file.originalname,
      file_size: file.size,
      thumbnails: '',
      user_id: userId,
      template_type: templateType,
      acl: file.ACL,
    };
  } catch (e) {
    logger.error(e);
    throw new ForbidenError('Can not upload to S3 server');
  };
}

/**
 * Create file object with storage type is local
 *
 * @param userId
 * @param file
 * @param templateType
 * @return {{url: string, storage_type: string, file_type: string, media_type, format, original_file_name, file_size, thumbnails: string, user_id: *, template_type: *}}
 */
export function createLocalFileObj(userId, file, templateType) {
  if (file.ACL === Enum.FILE_ACLS.public) {
    fs.renameSync(path.join(__dirname, '../../uploads/' + file.filename), path.join(__dirname, '../..' + Enum.FOLDER_LOCAL[file.ACL] + '/uploads/' + file.filename));
  }
  return {
    url: '/uploads/' + file.filename,
    storage_type: Enum.FILE_STORAGE_TYPE.local,
    file_type: mime.extension(file.mimetype),
    media_type: file.mimetype,
    format: file.mimetype,
    original_file_name: file.originalname,
    file_size: file.size,
    thumbnails: '',
    user_id: userId,
    template_type: templateType,
    acl: file.ACL
  };
}

/**
 * Count by fitter
 * @param {Object} req
 * @returns {Promise<*|Model>}
 */
export async function countByFitter(req) {
  const { query } = req.query;
  const searchWordQuery = query || '';
  return await FileModel.count({
    where: {
      [Op.or]: [
        {
          url: {
          [Op.like]: '%' + searchWordQuery + '%'
          },
        },
        {
          original_file_name: {
            [Op.like]: '%' + searchWordQuery + '%'
          }
        }
      ]
    }
  });
}

/**
 * Save File to db
 *
 * @param data
 * @param options
 * @return {Promise<>}
 */
export async function save(data, options) {
  return FileModel.create(data, options);
}

/**
 * Find file by id
 *
 * @param {integer} id
 * @returns {Promise<*|Model>}
 */
export async function findById(id){
  return FileModel.findById(id);
}

/**
 * Find file by id
 *
 * @param {integer} fileId
 * @param {integer} userId
 */
export async function findByIdAndUserId(fileId, userId){
  return await FileModel.findOne({
    where: {
      id: fileId,
      user_id: userId
    }
  });
}

/**
 * Update file by id
 *
 * @param {Object} data
 * @param {object} options
 * @returns {Promise<*|void>}
 */
export async function update(data, options) {
  return await FileModel.update(data, {
    where: options
  });
}

/**
 * Convert file to excel data object
 *
 * @param {Object} file
 * @param password
 * @returns {Promise}
 * @throws {ForbidenError}
 */
export async function parseData(file, password) {
  try{
    if (['xlsx', 'xls'].indexOf(file.get('file_type')) < 0) {
      throw new ForbidenError('Not supported file format ' + file.get('file_type'));
    }
    if (file.get('storage_type') === Enum.FILE_STORAGE_TYPE.local) {
      return await Excel.fromFileAsync(path.join(__dirname, '../..' + Enum.FOLDER_LOCAL[file.get('acl')] + file.get('url')), {
        password: password
      });
    } else {
      const fileBuffer = await this.getBinaryFromS3(file);
      return await Excel.fromDataAsync(fileBuffer, {
        password: password,
        fileExtend: file.get('file_type')
      });
    }
  } catch (e) {
    throw new ForbidenError(e.message || e, {file_id: file.get('id')});
  }
}

/**
 * Get binary file when upload to s3 private
 * 
 * @param {FileModel} file
 * @returns {Buffer} 
 */
export async function getBinaryFromS3(file) {
  const params = {
    Bucket: file.get('s3_bucket'),
    Key: file.get('s3_key'),
  };
  try{
    const fileS3 = await S3.getObject(params).promise();
    return fileS3.Body;
  } catch (e) {
    throw new ForbidenError('Can not read file from S3 server');
  }
}

/**
 * Remove file local when up load by multer
 * @param {String} filePath
 * @returns {Promise}
 */
export async function removeFromLocal(filePath) {
  if (fs.existsSync(filePath)) {
    return fs.unlinkSync(filePath);
  }
}

/**
 * Create download file
 * 
 * @param {Model} file
 * @param {Express} res
 * @return {Stream}
 */
export async function createFileDownload(file, res){
  if (file.get('storage_type') === Enum.FILE_STORAGE_TYPE.local) {
    const filePath = path.join(__dirname, '../..' + Enum.FOLDER_LOCAL[file.get('acl')] + file.get('url'));
    return res.download(filePath);
  } else {
    res.attachment(file.get('original_file_name'));
    res.setHeader('Content-disposition', 'attachment; filename=' + file.get('original_file_name'));
    res.setHeader('Content-type', file.get('media_type'));
    const params = {
      Bucket: file.get('s3_bucket'),
      Key: file.get('s3_key'),
    };
    return S3.getObject(params).createReadStream().pipe(res);
  }
}