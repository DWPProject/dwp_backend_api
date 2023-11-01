import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserSellerDto } from 'recipe/dto/User.dto';
import { multerOptions } from 'recipe/utils/uploadFile';
import { AuthGuard } from 'src/middleware/auth.middleware';
import { AuthService } from 'src/user/auth/service/auth/auth.service';

@Controller('seller')
export class SellerController {
  constructor(private userService: AuthService) {}

  @UseGuards(AuthGuard)
  @Post('/')
  @UseInterceptors(FileInterceptor('foto', multerOptions))
  async createAccSeller(
    @UploadedFile() foto: Express.Multer.File,
    @Body() createUserSellerDto: CreateUserSellerDto,
  ) {
    try {
      if (!foto) {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'File Not Null',
        };
      }
      createUserSellerDto.foto = foto.path;
      return await this.userService.createUserPenjual(createUserSellerDto);
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `${error}`,
      };
    }
  }

  @UseGuards(AuthGuard)
  @Get('/')
  async getDataUserSeller() {
    try {
      return await this.userService.getDataSeller();
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `${error}`,
      };
    }
  }
}