import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  SetMetadata,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { KontenService } from '../../service/konten/konten.service';
import { CreateBeritaDto, UpdateBeritaDto } from 'recipe/dto/Berita.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'recipe/utils/uploadFile';
import { RolesMiddleware } from 'src/middleware/roles.middleware';

@Controller('konten')
export class KontenController {
  constructor(private kontenService: KontenService) {}

  @Get('/')
  async getAllKonten() {
    try {
      return await this.kontenService.getAllDataKonten();
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
  @Post('/')
  @UseInterceptors(FileInterceptor('gambar'))
  async createNewKonten(
    @Body() createBeritaDto: CreateBeritaDto,
    @UploadedFile() gambar: Express.Multer.File,
  ) {
    try {
      return await this.kontenService.createKonten(createBeritaDto, gambar);
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
  @Put('/:id')
  @UseInterceptors(FileInterceptor('gambar'))
  async updateKontem(
    @UploadedFile() gambar: Express.Multer.File,
    @Param('id') id: number,
    @Body() updateBeritaDto: UpdateBeritaDto,
  ) {
    try {
      return await this.kontenService.updateKonten(updateBeritaDto, id, gambar);
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `${error}`,
      };
    }
  }

  @Get(':id')
  async getDetailDataKonten(@Param('id') id: number) {
    try {
      return await this.kontenService.getDataKontenById(id);
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
  async deleteDataKonten(@Param('id') id: number) {
    try {
      return await this.kontenService.deleteKonten(id);
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `${error}`,
      };
    }
  }
}
