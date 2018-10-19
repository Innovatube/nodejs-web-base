'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const email_templates = [
      {
        name: 'email_forgot_password',
        message: '<h2>Hi <%= username%></h2><p>You are receiving this email because we received a password reset request for your account.</p>'+
                '<table> <tr> <td align="center"> <p> <a href="<%= link %>" class="button">Reset Password</a> </p> </td> </tr> </table>'+
                '<p>If you did not request a password reset, no further action is required.</p>',
        subject: 'Reset Password Notification'
      }
    ];
    return queryInterface.bulkInsert('email_templates', email_templates, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('email_templates', null, {});
  }
};
