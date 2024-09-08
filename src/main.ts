import { NestFactory } from '@nestjs/core';
import { RootModule } from './root.module';
import { NextFunction, Request, Response } from 'express';

function globalMiddleareOne(req: Request, res: Response, next: NextFunction) {
  console.log('Global middleware one');
  next();
}
function globalMiddleareTwo(req: Request, res: Response, next: NextFunction) {
  console.log('Global middleware two');
  next();
}
async function bootstrap() {
  const app = await NestFactory.create(RootModule);
  app.use(globalMiddleareOne);
  app.use(globalMiddleareTwo);
  await app.listen(3000);
}
bootstrap();
