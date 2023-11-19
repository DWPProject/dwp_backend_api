import {
  Body,
  Controller,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from '../../service/auth/auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'recipe/utils/uploadFile';
import {
  CreateUserDto,
  LoginUserDto,
  forgotPasswordDto,
} from 'recipe/dto/User.dto';
import { UpdateUserParams } from 'recipe/utils/User.utils';
import { GlobalDto } from 'recipe/dto/Globa.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      console.log(createUserDto);
      return await this.authService.createUser(createUserDto);
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `${error}`,
      };
    }
  }

  @Post('/update')
  @UseInterceptors(FileInterceptor('foto'))
  async updateUser(
    @UploadedFile() foto: Express.Multer.File,
    @Body() updateUserDto: UpdateUserParams,
  ) {
    return await this.authService.updateUser(foto, updateUserDto);
  }

  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto) {
    try {
      return await this.authService.loginUser(loginUserDto);
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `${error}`,
      };
    }
  }

  @Post('/forgotPassword')
  async forgotPassword(@Body() forgotPasswordDto: forgotPasswordDto) {
    try {
      return await this.authService.forgotPassword(forgotPasswordDto);
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `${error}`,
      };
    }
  }

  @Post('/profile')
  async getProfileUser(@Body() globalDto: GlobalDto) {
    try {
      return await this.authService.getDataUser(globalDto.id);
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `${error}`,
      };
    }
  }
}
