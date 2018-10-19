import HttpStatus from 'http-status-codes';
import logger from '../config/winston';
import {slug} from '../utils/helper';

/**
 * Abstract error response func
 *
 * @param res
 * @param httpCode
 * @param code
 * @param message
 * @param data
 * @returns {*}
 */
function generateError(res, httpCode, code, message, data) {
  return res
    .status(httpCode)
    .json({
      code: code || httpCode,
      error: true,
      message: message,
      error_code: slug(message, '_'),
      data: data
    });
}

/**
 * Catch error response middleware
 *
 * @param  {object}   err
 * @param  {object}   req
 * @param  {object}   res
 * @param  {function} next
 */
export default function exec(err, req, res, next) {
  if (err.className !== 'ValidationError') {
    logger.error(err.stack);
  }
  switch (err.className) {
    case 'BadRequest':
      generateError(res, HttpStatus.BAD_REQUEST, null, err.message, null);
      break;

    case 'ForbidenError':
      generateError(res, HttpStatus.FORBIDDEN, null, err.message, err.extra);
      break;

    case 'NotFound':
      generateError(res, HttpStatus.NOT_FOUND, null, err.message, null);
      break;

    case 'ValidationError':
      generateError(res, HttpStatus.UNPROCESSABLE_ENTITY, null, err.message, err.extra);
      break;

    case 'LogicError':
      generateError(res, HttpStatus.CONFLICT, null, err.message);
      break;

    case 'ValueError':
      generateError(res, HttpStatus.CONFLICT, null, err.message);
      break;

    case 'LogisticsError':
      generateError(res, HttpStatus.CONFLICT, null, err.message);
      break;

    case 'StopSequenceNotChange':
      generateError(res, HttpStatus.CONFLICT, null, err.message);
      break;

    case 'Unauthorized':
      generateError(res, HttpStatus.UNAUTHORIZED, null, err.message, err.extra);
      break;

    default:
      generateError(res, HttpStatus.INTERNAL_SERVER_ERROR, null, 'Server error', null);
  }

}

