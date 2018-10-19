import Sequelize from 'sequelize';
import Database from '../config/database';
import * as Enum from "../config/enum";

const TaskModel = Database.define('tasks', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.BIGINT(20)
  },
  job_id: {
    type: Sequelize.BIGINT(20),
    references: { model: 'jobs', key: 'id' },
    onUpdate: 'restrict',
    onDelete: 'restrict'
  },
  check_points_raw: {
    type: Sequelize.STRING
  },
  common_raw: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  stops_raw: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  vehicles_raw: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  authorize_user: {
    type: Sequelize.STRING,
    allowNull: false
  },
  type: {
    type: Sequelize.ENUM(...Object.values(Enum.JOB_TYPE)),
    allowNull: false
  },
  status: {
    type: Sequelize.ENUM(...Object.values(Enum.TASK_STATUS)),
    defaultValue: Enum.TASK_STATUS.init
  },
  long_running_id: {
    type: Sequelize.BIGINT(20)
  },
  response: {
    type: Sequelize.TEXT
  },
  result: {
    type: Sequelize.TEXT
  },
  merged_result: {
    type: Sequelize.TEXT
  },
  trace_back: {
    type: Sequelize.TEXT
  },
  common: {
    type: Sequelize.VIRTUAL,
    get: function () {
      return this.common_raw ? JSON.parse(this.common_raw) : null
    }
  },
  stops: {
    type: Sequelize.VIRTUAL,
    get: function () {
      return this.stops_raw ? JSON.parse(this.stops_raw) : null
    }
  },
  vehicles: {
    type: Sequelize.VIRTUAL,
    get: function () {
      return this.vehicles_raw ? JSON.parse(this.vehicles_raw) : null
    }
  },
  check_points: {
    type: Sequelize.VIRTUAL,
    get: function () {
      if (!this.check_points_raw) {
        return null
      }

      let checkPoints = this.check_points_raw.split(',');
      checkPoints = checkPoints.map(checkPoint => {
        let [planId, seq] = checkPoint.split('|');

        return {plan_id: parseInt(planId), seq: parseInt(seq)};
      });

      return checkPoints;
    }
  },
  check_points_plan: {
    type: Sequelize.VIRTUAL,
    get: function () {
      if (this.check_points === null) {
        return null
      }

      return this.check_points.map(checkPoint => {
        return parseInt(checkPoint.plan_id);
      })
    }
  },
  action: {
    type: Sequelize.STRING(45),
    allowNull: false
  },
  split_points_raw: {
    type: Sequelize.STRING
  },
  split_point_plans: {
    type: Sequelize.VIRTUAL,
    get: function () {
      if (this.check_points === null) {
        return null
      }

      return JSON.parse(this.split_points_raw);
    }
  },
  finish_time_adjust_raw: {
    type: Sequelize.TEXT
  },
  finish_time_adjust: {
    type: Sequelize.VIRTUAL,
    get: function () {
      if (this.finish_time_adjust_raw === null) {
        return null
      }

      return this
        .finish_time_adjust_raw
        .split(',')
        .map(planId => parseInt(planId));
    }
  },

}, {
  updatedAt: 'updated_at',
  createdAt: 'created_at'
});

export default TaskModel;
