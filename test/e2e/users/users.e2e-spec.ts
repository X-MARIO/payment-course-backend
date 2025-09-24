import { INestApplication } from '@nestjs/common';
import * as http from 'node:http';
import * as request from 'supertest';

import { createTestApp } from '../utils';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createTestApp();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /api/v1/users -> should get an empty array of users', () => {
    return request(app.getHttpServer() as http.Server)
      .get('/api/v1/users')
      .expect(200)
      .expect([]);
  });
});
