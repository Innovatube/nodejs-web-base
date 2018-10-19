/* eslint-disable arrow-body-style */
const request = require('supertest');
const httpStatus = require('http-status-codes');
const { expect } = require('chai');
const app = require('../../app');
after(async () => {
  app.stop();
});

describe('Authentication API', () => {
  describe('POST /api/web/v1/auth/login', () => {
    it('should admin login is ok', () => {
      return request(app)
        .post('/api/admin/auth/login')
        .send({
          email: 'admin4@example.com',
          password: 'testtest'
        })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.token).to.be.an('string');
          expect(res.body.email).to.be.an('string');
          expect(res.body.is_admin).to.be.an('boolean');
        });
    });
  });

});
