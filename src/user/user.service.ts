import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User, UserDocument } from './entity/user.entity';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { updateDto } from './dto/update.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async getUser(id: string): Promise<User> {
    const user = await this.userModel.findById(id);

    if (!user) throw new NotFoundException('User does not exists');

    return user;
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.userModel.find();

    if (users.length <= 0) throw new NotFoundException('User does not exist');

    return users;
  }

  async createUser(userDto: UserDto): Promise<string> {
    const existingUser = await this.userModel.findOne({
      $or: [{ username: userDto.username }, { email: userDto.email }],
    });

    if (existingUser) throw new BadRequestException('User already exists');

    const salt = bcrypt.genSaltSync(12);

    const user = new this.userModel({
      username: userDto.username,
      email: userDto.email,
      password: bcrypt.hashSync(userDto.password, salt),
      phoneNumber: userDto.phoneNumber,
      role: userDto.role,
    });

    await user.save();

    return 'User created successfully';
  }

  async updateUser(id: string, userDto: updateDto): Promise<string> {
    const user = await this.userModel.findById(id);

    if (!user) throw new NotFoundException('User does not exist');

    await user.updateOne(
      {
        username: userDto.username,
        email: userDto.email,
        phoneNumber: userDto.phoneNumber,
        role: userDto.role,
      },
      { new: true },
    );
    return 'User updated successfully';
  }

  async deleteUser(id: string): Promise<string> {
    const user = await this.userModel.findById(id);

    if (!user) throw new NotFoundException('User does not exist');

    await user.deleteOne();
    return 'User delete successfully';
  }

  async changePassword(
    user: any,
    { currentPassword, newPassword }: ChangePasswordDto,
  ): Promise<string> {
    const currentUser = await this.userModel.findById(user.id);
    if (!user) throw new UnauthorizedException();

    if (!bcrypt.compareSync(currentPassword, currentUser.password))
      throw new BadRequestException('Current password is incorrect');

    if (currentPassword === newPassword)
      throw new BadRequestException(
        'New password must have different current password',
      );

    const salt = bcrypt.genSaltSync(12);
    await currentUser.updateOne({
      password: bcrypt.hashSync(newPassword, salt),
    });
    return 'Change password successfully';
  }
}
