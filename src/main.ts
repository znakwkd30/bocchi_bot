import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Logger as PinoLogger } from 'nestjs-pino';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    bufferLogs: true
  });

  app.useLogger(app.get(PinoLogger));
  app.useGlobalPipes(new ValidationPipe());
  app.disable('x-powered-by');
  app.use('/ping', async function (req: any, res: any) {
    res.status(200).send('pong');
  });

  const port = process.env.ENV === 'prod' ? 3334 : 3333;

  await app.listen(port);

  console.log(`server start ${port}`);
}

bootstrap();
