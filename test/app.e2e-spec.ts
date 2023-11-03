import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('simulates a race condition in CartItem orderNow service', async () => {
    const userId1 = '49dd556a53'; // Ganti dengan ID pengguna pertama
    const userId2 = '2fc2aac554'; // Ganti dengan ID pengguna kedua
    const requests = [];

    for (let i = 0; i < 2; i++) {
      requests.push(
        request(app.getHttpServer())
          .post('/api/user/shop/cart')
          .send({ user_id: userId1 })
          .expect(201),
      );
      requests.push(
        request(app.getHttpServer())
          .post('/api/user/shop/cart')
          .send({ user_id: userId2 })
          .expect(201),
      );
    }

    await Promise.all(requests);
  });
});
