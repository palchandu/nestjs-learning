import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const protocol = req.protocol;
    const host = req.hostname;
    const url = req.originalUrl;
    const method = req.method;
    const date = new Date().toDateString();
    console.log(protocol + '://' + host + url + '  ' + method + '  ' + date);

    console.log('Module based middleare for user module');
    next();
  }
}
