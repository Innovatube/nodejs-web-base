'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const password = bcrypt.hashSync('testtest', parseInt(process.env.SALT_ROUNDS) || 10);
    let users = [];
    var i = 0;
    for (i = 0; i <= 10; i++) {
      users.push({
        first_name: 'test'+i,
        last_name: 'test'+i,
        email: 'test'+i+'@example.com',
        password: password,
        status: true,
        name: 'test'+i,
      });
    }
    users.push({first_name: 'le', last_name: 'anh', email: 'lekoi9x@gmail.com', password: password, status: true, name: 'test'+i});
    users.push({first_name: 'wendy', last_name: 'nguyen', email: 'wendy.nguyen@innovatube.com', password: password, status: true, name: 'wendeynguyen'});
    users.push({first_name: 'hoang', last_name: 'sara', email: 'sara.hoang@innovatube.com', password: password, status: true, name: 'sarahoang'});
    return queryInterface.bulkInsert('users', users, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
