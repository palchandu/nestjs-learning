import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor() {}

  createUser() {
    return 'User Created here';
  }
  getUser() {
    return 'Get all user here';
  }
}
