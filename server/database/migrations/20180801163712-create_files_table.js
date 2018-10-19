'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('files', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT(20)
      },
      url: {
        allowNull: false,
        type: Sequelize.STRING
      },
      title: {
        type: Sequelize.STRING,
        defaultValue: ''
      },
      entity_type: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: ''
      },
      entity_id: {
        allowNull: false,
        type: Sequelize.BIGINT(20),
        defaultValue: 0
      },
      storage_type: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: ''
      },
      file_category_type: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: ''
      },
      file_type: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: ''
      },
      s3_key: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: ''
      },
      s3_bucket: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: ''
      },
      s3_region: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: ''
      },
      media_type: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: ''
      },
      format: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: ''
      },
      original_file_name: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: ''
      },
      file_size: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: ''
      },
      width: {
        allowNull: false,
        type: Sequelize.INTEGER(11),
        defaultValue: 0
      },
      height: {
        allowNull: false,
        type: Sequelize.INTEGER(11),
        defaultValue: 0
      },
      thumbnails: {
        allowNull: false,
        type: Sequelize.TEXT,
        defaultValue: ''
      },
      is_enabled: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      status: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('files');
  }
};
