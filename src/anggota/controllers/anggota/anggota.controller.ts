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
} from '@nestjs/common';
import { CreateAnggotaDto, UpdateAnggotaDto } from 'recipe/dto/Anggota.dto';
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
  async createAnggota(@Body() createAnggotaDto: CreateAnggotaDto) {
    try {
      return await this.anggotaService.createAnggota(createAnggotaDto);
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `${error}`,
      };
    }
  }

  @Put(':id')
  async updateAnggota(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAnggotaDto: UpdateAnggotaDto,
  ) {
    try {
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
