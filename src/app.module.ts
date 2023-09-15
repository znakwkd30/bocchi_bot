import {
  Module,
  NestModule,
  MiddlewareConsumer,
  OnApplicationBootstrap
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { LoggerModule } from 'nestjs-pino';
import { SlackModule } from 'nestjs-slack-bolt';
import { JapaneseController } from './controllers/japanese.controller';
import { StudyController } from './controllers/study.controller';
import { SlackRedisModule } from './redis/slack-redis.module';
import { LaftelController } from './controllers/laftel.controller';
import { HealthController } from './controllers/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'env/.env',
      ignoreEnvFile: process.env.ENV !== 'local'
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.ENV !== 'prod' ? 'trace' : 'info'
      }
    }),
    EventEmitterModule.forRoot(),
    SlackRedisModule.forRoot(),
    SlackModule
  ],
  controllers: [
    JapaneseController,
    StudyController,
    LaftelController,
    HealthController
  ],
  providers: []
})
export class AppModule implements NestModule, OnApplicationBootstrap {
  constructor(private readonly refHost: HttpAdapterHost<any>) {}

  async onApplicationBootstrap() {
    const server = this.refHost.httpAdapter.getHttpServer();
    server.keepAliveTimeout = 910 * 1000;
    server.headersTimeout = 910 * 1000;
  }

  configure(consumer: MiddlewareConsumer) {}
}
