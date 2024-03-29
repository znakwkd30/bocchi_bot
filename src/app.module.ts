import {
  Module,
  NestModule,
  MiddlewareConsumer,
  OnApplicationBootstrap
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { LoggerModule } from 'nestjs-pino';
import { SlackModule } from 'nestjs-slack-bolt';
import { JapaneseController } from './controllers/japanese.controller';
import { StudyController } from './controllers/study.controller';
import { SlackRedisModule } from './redis/slack-redis.module';
import { LaftelController } from './controllers/laftel.controller';
import { HealthController } from './controllers/health.controller';
import { CommandController } from './controllers/command.controller';
import { FamousSayingController } from './controllers/famous-saying.controller';
import { PakaIsFreeController } from './controllers/paka-is-free.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.ENV !== 'local' ? 'env/.env' : 'env/dv.env'
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.ENV !== 'prod' ? 'trace' : 'info'
      }
    }),
    EventEmitterModule.forRoot(),
    SlackRedisModule.forRoot(),
    ScheduleModule.forRoot(),
    SlackModule
  ],
  controllers: [
    JapaneseController,
    StudyController,
    LaftelController,
    HealthController,
    CommandController,
    FamousSayingController,
    PakaIsFreeController
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
