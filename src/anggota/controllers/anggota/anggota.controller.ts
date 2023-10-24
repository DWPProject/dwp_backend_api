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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateAnggotaDto, UpdateAnggotaDto } from 'recipe/dto/Anggota.dto';
import { multerOptions } from 'recipe/utils/uploadFile';
import { AnggotaService } from 'src/anggota/service/anggota/anggota.service';

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

  @Post()
  @UseInterceptors(FileInterceptor('foto', multerOptions))
  async createAnggota(
    @UploadedFile() foto: Express.Multer.File,
    @Body() createAnggotaDto: CreateAnggotaDto,
  ) {
    try {
      if (!foto) {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'File Not Null',
        };
      }
      createAnggotaDto.foto = foto.path;
      return await this.anggotaService.createAnggota(createAnggotaDto);
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `${error}`,
      };
    }
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('foto', multerOptions))
  async updateAnggota(
    @UploadedFile() foto: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAnggotaDto: UpdateAnggotaDto,
  ) {
    try {
      if (!foto) {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'File Not Null',
        };
      }
      updateAnggotaDto.foto = foto.path;
      return await this.anggotaService.updateAnggota(updateAnggotaDto, id);
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `${error}`,
      };
    }
  }

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
