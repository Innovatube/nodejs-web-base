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
    it('should user login is ok', () => {
      return request(app)
        .post('/api/v1/auth/login')
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
    it('should user login validate error', () => {
      return request(app)
        .post('/api/v1/auth/login')
        .send()
        .expect(httpStatus.UNPROCESSABLE_ENTITY)
        .then((res) => {
          expect(res.body.error).to.be.an('boolean');
          expect(res.body.message).to.be.an('string');
          expect(res.body.data).to.be.an('object');
        });
    });
    it('should user login error email or password', () => {
      return request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'admin14@example.com',
          password: 'testtest1'
        })
        .expect(httpStatus.FORBIDDEN)
        .then((res) => {
          expect(res.body.error).to.be.an('boolean');
          expect(res.body.message).to.be.an('string');
        });
    });
    it('should user forgot password', () => {
      return request(app)
        .post('/api/v1/auth/forgot-password')
        .send({
          email: 'admin4@example.com'
        })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.error).to.be.an('boolean');
          expect(res.body.error).to.equal(false);
          expect(res.body.message).to.be.an('string');
        });
    });
  });

});
