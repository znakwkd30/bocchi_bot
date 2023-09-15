import { PinoLogger } from 'nestjs-pino';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Global()
@Module({
  providers: []
})
export class SlackRedisModule {
  static forRoot(): DynamicModule {
    return {
      module: SlackRedisModule,
      imports: [
        RedisModule.forRootAsync({
          inject: [PinoLogger, EventEmitter2],
          useFactory: async (
            logger: PinoLogger,
            eventEmitter: EventEmitter2
          ) => {
            return {
              config: {
                host: process.env.REDIS_HOST,
                port: 6379,
                db: 15,
                maxRetriesPerRequest: 1,
                commandTimeout: 2000,
                retryStrategy: (times) => {
                  logger.info(`Redis 연결 실패 ${times}번째 시도중`);

                  return 5000;
                },
                onClientCreated: (client) => {
                  client.on('connect', () => {
                    eventEmitter.emit('load_study');
                  });
                }
              }
            };
          }
        })
      ]
    };
  }
}
