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
import { CreateUserDto } from 'recipe/dto/User.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @UseInterceptors(FileInterceptor('foto', multerOptions))
  async register(
    @UploadedFile() foto: Express.Multer.File,
    @Body() createUserDto: CreateUserDto,
  ) {
    try {
      if (!foto) {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'File Not Null',
        };
      }
      createUserDto.foto = foto.path;
      return await this.authService.createUser(createUserDto);
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `${error}`,
      };
    }
  }
}