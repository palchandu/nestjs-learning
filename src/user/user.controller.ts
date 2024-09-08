import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { UserPipe } from './pipe/user.pipe';
import { UserGuard } from './user.guard';
//import { UserException } from './user.exception';

@Controller('user')
export class UserController {
  constructor(private userServic: UserService) {}

  @Get('/list')
  findAll(): string {
    return this.userServic.getUser();
  }

  @Post('/add')
  @UseGuards(new UserGuard())
  addUser(@Body(new UserPipe()) user: UserDto): string {
    console.log('User', user);
    //throw new UserException();
    return this.userServic.createUser();
  }
  @Get('/details/:id')
  findUserDetails(@Param('id', ParseIntPipe) id: number): string {
    return `This is the user details ${typeof id}`;
  }
}
