import { ValidationPipe } from '@douglasneuroinformatics/libnest/core';
import { CryptoService } from '@douglasneuroinformatics/libnest/crypto';
import { MockFactory } from '@douglasneuroinformatics/libnest/testing';
import { HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { type NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { AbilityFactory } from '@/ability/ability.factory';
import { ConfigurationService } from '@/configuration/configuration.service';
import { UsersService } from '@/users/users.service';

import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';

describe('/auth', () => {
  let app: NestExpressApplication;
  let server: any;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        MockFactory.createForService(AbilityFactory),
        MockFactory.createForService(CryptoService),
        MockFactory.createForService(JwtService),
        MockFactory.createForService(UsersService),
        {
          provide: ConfigurationService,
          useValue: {}
        }
      ]
    }).compile();

    app = moduleRef.createNestApplication({
      logger: false
    });

    app.useGlobalPipes(new ValidationPipe());

    await app.init();
    server = app.getHttpServer();
  });

  describe('POST /auth/login', () => {
    it('should reject a request with an empty body', async () => {
      const response = await request(server).post('/auth/login').send();
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
    it('should reject a request with a username but no password', async () => {
      const response = await request(server).post('/auth/login').send({
        username: 'admin'
      });
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
    it('should reject a request with a password but no username', async () => {
      const response = await request(server).post('/auth/login').send({
        username: 'admin'
      });
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
