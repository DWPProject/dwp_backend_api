import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  SetMetadata,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserSellerDto, DeleteAccSeller } from 'recipe/dto/User.dto';
import { multerOptions } from 'recipe/utils/uploadFile';
import { AuthGuard } from 'src/middleware/auth.middleware';
import { RolesMiddleware } from 'src/middleware/roles.middleware';
import { AuthService } from 'src/user/auth/service/auth/auth.service';

@Controller('seller')
export class SellerController {
  constructor(private userService: AuthService) {}

  // @UseGuards(AuthGuard)
  @SetMetadata('roles', ['admin'])
  @UseGuards(RolesMiddleware)
  @Post('/')
  @UseInterceptors(FileInterceptor('foto', multerOptions))
  async createAccSeller(
    @UploadedFile() foto: Express.Multer.File,
    @Body() createUserSellerDto: CreateUserSellerDto,
  ) {
    try {
      if (!foto) {
        createUserSellerDto.foto = 'Default';
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

  // @UseGuards(AuthGuard)
  // @SetMetadata('roles', ['admin'])
  // @UseGuards(RolesMiddleware)
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

  @Delete('/')
  async deleteAccSeller(@Body() deleteAccSeller: DeleteAccSeller) {
    try {
      return await this.userService.DeleteAccSeller(deleteAccSeller);
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `${error}`,
      };
    }
  }
}
