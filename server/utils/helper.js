import {ValueError} from "../errors";
import moment from 'moment';

export function randString(len) {
  var s = '';
  while(s.length<len&&len>0){
      var r = Math.random();
      s+= (r<0.1?Math.floor(r*100):String.fromCharCode(Math.floor(r*26) + (r>0.5?97:65)));
  }
  return s;
}

/**
 * Create uuid
 *  @return {String}
 */
export function uuid()
{
   var chars = '0123456789abcdef'.split('');

   var uuid = [], rnd = Math.random, r;
   uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
   uuid[14] = '4'; // version 4

   for (var i = 0; i < 36; i++)
   {
      if (!uuid[i])
      {
        r = 0 | rnd()*16;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r & 0xf];
      }
   }
   return uuid.join('');
}

export function slug(title, separator) {
  if (!title || typeof title !== 'string') {
    return '';
  }
  if(typeof separator == 'undefined') separator = '-';

  // Convert all dashes/underscores into separator
  var flip = separator == '-' ? '_' : '-';
  title = title.replace(flip, separator);

  // Remove all characters that are not the separator, letters, numbers, or whitespace.
  title = title.toLowerCase()
      .replace(new RegExp('[^a-z0-9' + separator + '\\s]', 'g'), '');

  // Replace all separator characters and whitespace by a single separator
  title = title.replace(new RegExp('[' + separator + '\\s]+', 'g'), separator);

  return title.replace(new RegExp('^[' + separator + '\\s]+|[' + separator + '\\s]+$', 'g'),'');
}


/**
 * Copy properties, if not exist key or value is null, ignore
 *
 * @param fromObj
 * @param toObj
 * @param keys
 * @param allowFalse
 * @return {*}
 */
export function copyProperties(fromObj, toObj, keys, allowFalse=false) {
  let _keys = !Array.isArray(keys) ? [keys]: keys;

  for (let key of _keys) {
    if (fromObj[key] !== null && fromObj[key] !== undefined) {
      toObj[key] = fromObj[key];
    } else {
      if (allowFalse) {
        toObj[key] = null;
      }
    }
  }

  return toObj;
}

/**
 * Strictly parse int
 *
 * @param value
 * @return {number}
 */
export function parseInt(value) {
  let parsedValue = Number.parseInt(value);
  if (!Number.isInteger(parsedValue)) {
    throw new ValueError(`${value} is not an integer`);
  }

  return value;
}

/**
 * Strictly parse float
 *
 * @param value
 * @return {number}
 */
export function parseFloat(value) {
  let parsedValue = Number.parseFloat(value);
  if (isNaN(parsedValue)) {
    throw new ValueError(`${value} is not a float`);
  }

  return value
}

/**
 * Strictly parse enum
 *
 * @param value
 * @param inclusion
 * @return {*}
 */
export function parseEnum(value, inclusion) {
  if (inclusion.indexOf(value) === -1) {
    throw new ValueError(`${value} is not in ${inclusion}`);
  }

  return value;
}

/**
 * Strictly parse parse time
 *
 * @param value
 * @param fromFormat
 * @param toFormat
 * @return {*}
 */
export function parseTime(value, fromFormat='H:m:s', toFormat='HH:mm:ss') {
  if (moment.isMoment(value)) {
    return value.format(toFormat);
  }

  if (!moment(value, fromFormat, true).isValid()) {
    throw new ValueError(`${value} is not a valid time`);
  }

  return moment(value, fromFormat).format(toFormat);
}

/**
 * Stricly parse datetime
 *
 * @param value
 * @param fromFormat
 * @param toFormat
 * @return {*}
 */
export function parseDateTime(value, fromFormat='YYYY-M-D H:m:s', toFormat='YYYY-MM-DD HH:mm:ss') {
  if (moment.isMoment(value)) {
    return value.format(toFormat);
  }

  if (!moment(value, fromFormat, true).isValid()) {
    throw new ValueError(`${value} is not a valid datetime`);
  }

  return moment(value, fromFormat).format(toFormat);
}

/**
 * Required a value, and return it
 *
 * @param value
 * @return {*}
 */
export function required(value) {
  if (value === undefined || value === null) {
    throw new ValueError(`${value} is required`);
  }

  return value;
}

/**
 * Assign key-value for given object
 * Parsing value when assign
 * If value is undefined or null, ignore
 *
 * @param object
 * @param key
 * @param callback
 * @param isRequired
 * @param args
 */
export function assign(object, key, callback, isRequired = false, ...args) {
  if (args[0] === undefined || args[0] === null) {
    if (isRequired) {
      throw new ValueError(`Key ${key} is required, ${args[0]} was given`);
    }

    return;
  }

  if (typeof callback === "function") {
    try {
      object[key] = callback(...args);

    } catch (e) {
      throw new ValueError(`Cannot assign to key ${key} value ${args[0]}, ${e.message}`);
    }

  } else {
    object[key] = args[0];
  }
}

/**
 * Extract time from datetime string
 *
 * @param dateTime
 * @param dateTimeFormat
 * @param timeFormat
 * @return {string}
 */
export function extractTime(dateTime, dateTimeFormat='YYYY-MM-DD HH:mm:ss', timeFormat='HH:mm:ss') {
  if (!moment(dateTime, dateTimeFormat, true).isValid()) {
    throw new ValueError(`${value} is not a valid date time`);
  }

  return moment(dateTime, dateTimeFormat).format(timeFormat);
}

/**
 * Delete multiple key of object at once
 *
 * @param object
 * @param keys
 */
export function deleteAttrs(object, keys) {
  for (let key of keys) {
    if (object[key] !== undefined) {
      delete object[key];
    }
  }
}

export function roundOneDigit(value) {
  return Math.round(value * 10) / 10;
}