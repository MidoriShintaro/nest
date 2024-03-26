import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User, UserRole } from './entity/user.entity';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { UserDto } from './dto/user.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { RolesGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('/api/user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/:id')
  @HttpCode(200)
  async getUser(@Param('id') id: string): Promise<User> {
    return await this.userService.getUser(id);
  }

  @Get()
  @HttpCode(200)
  @UseGuards(RolesGuard)
  @Roles([UserRole.ADMIN])
  async getAllUser(@GetUser() user:User): Promise<User[]> {
    console.log('user in usercontroller is', user);
    return await this.userService.getAllUsers();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() userDto: UserDto): Promise<string> {
    return await this.userService.createUser(userDto);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Roles([UserRole.ADMIN])
  async updateUser(
    @Param('id') id: string,
    @Body() userDto: UserDto,
  ): Promise<string> {
    return await this.updateUser(id, userDto);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Roles([UserRole.ADMIN])
  async deleteUser(@Param('id') id: string): Promise<string> {
    return await this.deleteUser(id);
  }

  @Put('/change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @GetUser() user: User,
  ): Promise<string> {
    return await this.changePassword(changePasswordDto, user);
  }
}
