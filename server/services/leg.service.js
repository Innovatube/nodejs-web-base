import LegModel from '../models/leg.model';

/**
 *
 * @param legID
 * @returns {Promise<*|Model>}
 */
export async function findById(legID) {
  return await LegModel.findById(legID);
}

/**
 * Update leg
 *
 * @param id
 * @param data
 * @returns {Promise<void>}
 */
export async function update(id, data) {
  return await LegModel
    .update(data, {
      where: {id: id}
    });
}

/**
 * Save leg to DB
 *
 * @param {object} options
 * @param {object} data
 * @returns {Promise<*>}
 */
export async function save(data, options) {
  return await LegModel.create(data, options)
}

/**
 * Save multiple records at a time
 *
 * @param data
 * @param options
 * @returns {Promise<Array<Model>>}
 */
export async function bulkSave(data, options) {
  return await LegModel.bulkCreate(data, options);
}