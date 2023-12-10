import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  SetMetadata,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateAnggotaDto, UpdateAnggotaDto } from 'recipe/dto/Anggota.dto';
import { multerOptions } from 'recipe/utils/uploadFile';
import { AnggotaService } from '../../service/anggota/anggota.service';
import { AuthGuard } from 'src/middleware/auth.middleware';
import { RolesMiddleware } from 'src/middleware/roles.middleware';
import { JwtService } from '@nestjs/jwt';

@Controller('anggota')
export class AnggotaController {
  constructor(private anggotaService: AnggotaService) {}

  @Get()
  async getAnggota() {
    try {
      return await this.anggotaService.getAllDataAnggota();
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `${error}`,
      };
    }
  }

  // @UseGuards(AuthGuard)
  @SetMetadata('roles', ['admin'])
  @UseGuards(RolesMiddleware)
  @Post()
  @UseInterceptors(FileInterceptor('foto'))
  async createAnggota(
    @UploadedFile() foto: Express.Multer.File,
    @Body() createAnggotaDto: CreateAnggotaDto,
  ) {
    try {
      return await this.anggotaService.createAnggota(createAnggotaDto, foto);
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `${error}`,
      };
    }
  }

  // @UseGuards(AuthGuard)
  @SetMetadata('roles', ['admin'])
  @UseGuards(RolesMiddleware)
  @Put(':id')
  @UseInterceptors(FileInterceptor('foto'))
  async updateAnggota(
    @UploadedFile() foto: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAnggotaDto: UpdateAnggotaDto,
  ) {
    try {
      return await this.anggotaService.updateAnggota(
        updateAnggotaDto,
        id,
        foto,
      );
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `${error}`,
      };
    }
  }

  // @UseGuards(AuthGuard)
  @SetMetadata('roles', ['admin'])
  @UseGuards(RolesMiddleware)
  @Delete(':id')
  async deleteAnggota(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.anggotaService.deleteAnggota(id);
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `${error}`,
      };
    }
  }
}
