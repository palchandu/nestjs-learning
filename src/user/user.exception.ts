import { HttpException, HttpStatus } from '@nestjs/common';

export class UserException extends HttpException {
  constructor() {
    super('This is user custom exception', HttpStatus.BAD_REQUEST);
  }
}
