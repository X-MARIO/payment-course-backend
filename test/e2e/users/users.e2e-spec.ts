import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { createTestApp } from '../utils';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  // Перед каждым тестом создаем приложение с помощью нашей утилиты
  beforeEach(async () => {
    app = await createTestApp();
  });

  // После каждого теста корректно закрываем приложение
  afterEach(async () => {
    await app.close();
  });

  it('GET /api/v1/users -> should get an empty array of users', () => {
    return request(app.getHttpServer())
      .get('/api/v1/users')
      .expect(200)
      .expect([]); // Ожидаем пустой массив
  });
});
