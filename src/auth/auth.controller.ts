import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredential } from './dto/authCredential.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';

@Controller('/api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body()
    authCredential: AuthCredential,
  ): Promise<{ user; token }> {
    return await this.authService.login(authCredential);
  }

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body()
    authCredential: AuthCredential,
  ): Promise<string> {
    return await this.authService.register(authCredential);
  }

  @Post('/forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() email: ForgotPasswordDto): Promise<string> {
    return await this.authService.forgotPassword(email);
  }

  @Put('/reset-password/:token')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Param('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<string> {
    return await this.authService.resetPassword(token, resetPasswordDto);
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body('token') token: string): Promise<string> {
    return await this.authService.logout(token);
  }
}
