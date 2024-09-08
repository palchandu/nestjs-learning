import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
@Injectable()
export class UserGuard implements CanActivate {
  public key: string = 'qwertyuiopasdfghjklzxcvbnm';
  canActivate(context: ExecutionContext): boolean {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    console.log('req', request.headers['key']);
    if (request.headers['key'] == undefined) return false;
    return request.headers['key'] === this.key;
  }
}
