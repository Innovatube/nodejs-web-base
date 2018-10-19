import bcrypt from 'bcrypt';
import Sequelize from 'sequelize';
import UserModel from '../models/user.model';
import StopModel from '../models/stop.model';
import VehicleModel from '../models/vehicle.model';
import LegModel from '../models/leg.model';
import PlanModel from '../models/plan.model';
import FleetModel from '../models/fleet.model';
import JobModel from '../models/job.model';
import FileModel from '../models/file.model';
import moment from 'moment';
const Op = Sequelize.Op;

export async function findUserByIdAndStatus(userId, status) {
  return UserModel.findOne({
    where: {
      id: userId,
      status: status
    }
  });
}

/**
 * Get list users
 * @param {Object} req
 * @returns {Promise<*|Model>}
 */
export async function  getList(req) {
  const { offset, limit, order, direction, query } = req.query;
  const offsetQuery = parseInt(offset) || 0;
  const limitQuery = parseInt(limit) || 20;
  const orderQuery = order === 'asc' ? 'asc' : 'desc';
  const searchWordQuery = query || '';
  return await UserModel.findAll({
    attributes: ['id', 'name', 'email', 'company', 'status', 'is_admin', 'change_password_enforcement', 'password_updated_at', 'password_expired_days', 'created_at'],
    offset: offsetQuery,
    limit: limitQuery,
    order: [[direction, orderQuery]],
    where: {
      [Op.or]: [
        {
          name: {
          [Op.like]: '%' + searchWordQuery + '%'
          },
        },
        {
          company: {
            [Op.like]: '%' + searchWordQuery + '%'
          }
        },
        {
          email: {
            [Op.like]: '%' + searchWordQuery + '%'
          }
        }
      ]
    }
  });
}

/**
 * Count by fitter
 * @param {Object} req
 * @returns {Promise<*|Model>}
 */
export async function countByFitter(req) {
  const { query } = req.query;
  const searchWordQuery = query || '';
  return await UserModel.count({
    where: {
      [Op.or]: [
        {
          name: {
          [Op.like]: '%' + searchWordQuery + '%'
          },
        },
        {
          company: {
            [Op.like]: '%' + searchWordQuery + '%'
          }
        }
      ]
    }
  });
}

export async function updatePasswordById(userId, password) {
  return UserModel.update({
    password: bcrypt.hashSync(password, parseInt(process.env.SALT_ROUNDS) || 10),
    password_updated_at: moment.now()
  }, {
    where: {
      id: userId
    }
  });
}

/**
 * Find user by its ID
 *
 * @param userID
 * @returns {Promise<*|Model>}
 */
export async function findById(userID) {
  return UserModel.findById(userID, {
    include: [{
      model: FileModel,
    }]
  });
}

/**
 *  Update user
 *
 * @param id
 * @param data object of user
 * @returns {Promise<void>}
 */
export async function update(id, data) {
  return UserModel
    .update(data, {
        where: {id: id}
    });
}

export function comparePassword(plain, hash) {
  return bcrypt.compareSync(plain, hash);
}
/**
 *  Create user
 *
 * @param {object} options
 * @param {object} data
 * @returns {Promise<*>}
 */
export async function create(data, options) {
  return await UserModel.create(data, options);
}

/**
 *  Destroy users by list user id
 *
 * @param {Array} userIds
 * @returns {Promise<*>}
 */
export async function destroy(userIds) {
  const options = {
    where: {
      user_id: {
        $in: userIds,
      }
    }
  };
  const jobs = await JobModel.findAll(options);
  const jobIds = [];
  jobs.forEach(job => {
    jobIds.push(job.get('id'));
  });
  const optionsJob = {
    where: {
      job_id: {
        $in: jobIds
      }
    }
  };
  const fleets = await FleetModel.findAll(optionsJob);
  const fleetIds = [];
  fleets.forEach(flet => {
    fleetIds.push(flet.get(id));
  });
  const optionFleets = {
    where: {
      fleet_id: {
        $in: fleetIds
      }
    }
  };

  const plans = await PlanModel.findAll(optionFleets);
  const planIds = [];
  plans.forEach(plan => {
    planIds.push(plan.get('id'));
  });
  const optionPlans = {
    where: {
      plan_id: planIds
    }
  };
  await StopModel.destroy(optionsJob);
  await VehicleModel.destroy(optionsJob);
  await LegModel.destroy(optionPlans);
  await PlanModel.destroy(optionFleets);
  await FleetModel.destroy(optionsJob);

  await FileModel.destroy(options);
  return await UserModel.destroy({
    where: {
      id: {
        $in: userIds,
      }
    }
  });
}

/**
 * Find by email
 *
 * @param email
 * @return {Promise<Promise<*|Model>|Promise<Model>>}
 */
export async function findByEmail(email) {
  return UserModel.findOne({
    where: {email: email}
  })
}
