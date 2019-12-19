require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const User = require('../lib/model/User');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can sign up a user', () => {
    return request(app)
      .post('/api/v1/user/signup')
      .send({ email: 'test@test.com', password: 'password' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          email: 'test@test.com',
          __v: 0
        });
      });
  });

  it('can log in a user', async() => {
    const user = await User.create({ email: 'test@test.com', password: 'password' });
    return request(app)
      .post('/api/v1/user/login')
      .send({ email: 'test@test.com', password: 'password' })
      .then(res => {
        expect(res.body).toEqual({
          _id: user.id,
          email: 'test@test.com',
          __v: 0
        });
      });
  });


  it('fails when a bad email is used', async() => {
    await User.create({ email: 'test@test.com', password: 'password' });
    return request(app)
      .post('/api/v1/user/login')
      .send({ email: 'no@test.com', password: 'password' })
      .then(res => {
        expect(res.body).toEqual({
          message: 'Invalid email/password',
          status: 401
        });
      });
  });

  it('fails when a bad password is used', async() => {
    await User.create({ email: 'test@test.com', password: 'password' });
    return request(app)
      .post('/api/v1/user/login')
      .send({ email: 'test@test.com', password: 'pass' })
      .then(res => {
        expect(res.body).toEqual({
          message: 'Invalid email/password',
          status: 401
        });
      });
  });

});
