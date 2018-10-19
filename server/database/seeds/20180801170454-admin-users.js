'use strict';
const bcrypt = require('bcrypt');
module.exports = {
  up: (queryInterface, Sequelize) => {
    const password = bcrypt.hashSync('testtest', parseInt(process.env.SALT_ROUNDS) || 10);
    let adminUsers = [];
    var i = 0;
    for (i = 0; i <= 10; i++) {
      adminUsers.push({
        name: 'admin'+i,
        email: 'admin'+i+'@example.com',
        password: password,
        status: true,
        remember_token: '',
        profile_image_id: 0,
        is_admin: true
      });
    }
    return queryInterface.bulkInsert('users', adminUsers, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
