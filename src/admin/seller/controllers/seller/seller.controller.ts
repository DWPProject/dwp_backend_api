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
import {
  CreateUserSellerDto,
  DeleteAccSeller,
  UpdateUserSellerDto,
} from 'recipe/dto/User.dto';
import { multerOptions } from 'recipe/utils/uploadFile';
import { AuthGuard } from 'src/middleware/auth.middleware';
import { RolesMiddleware } from 'src/middleware/roles.middleware';
import { AuthService } from 'src/user/auth/service/auth/auth.service';

@Controller('seller')
export class SellerController {
  constructor(private userService: AuthService) {}

  // @UseGuards(AuthGuard)
  // @SetMetadata('roles', ['admin'])
  // @UseGuards(RolesMiddleware)
  @Post('/')
  @UseInterceptors(FileInterceptor('foto'))
  async createAccSeller(
    @UploadedFile() foto: Express.Multer.File,
    @Body() createUserSellerDto: CreateUserSellerDto,
  ) {
    try {
      return await this.userService.createUserPenjual(
        foto,
        createUserSellerDto,
      );
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `${error}`,
      };
    }
  }

  @Post('/update')
  @UseInterceptors(FileInterceptor('foto'))
  async updateSellerAcc(
    @UploadedFile() foto: Express.Multer.File,
    @Body() updateUserSellerDto: UpdateUserSellerDto,
  ) {
    try {
      return await this.userService.updateUserPenjual(
        foto,
        updateUserSellerDto,
      );
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

  @Post('/delete')
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
