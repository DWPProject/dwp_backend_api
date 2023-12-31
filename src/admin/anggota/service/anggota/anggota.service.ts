import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Anggota } from 'recipe/entities/Anggota';
import {
  CreateAnggotaParams,
  UpdateAnggotaParams,
} from 'recipe/utils/Anggota.utils';
import { UploadService } from 'src/cloudinary/service/service.service';
import { Repository } from 'typeorm';

@Injectable()
export class AnggotaService {
  constructor(
    @InjectRepository(Anggota)
    private anggotaRepository: Repository<Anggota>,
    private uploadCloudinary: UploadService,
  ) {}
  async getAllDataAnggota() {
    const data = await this.anggotaRepository.find();
    return {
      statusCode: HttpStatus.OK,
      status: 'Success',
      message: 'Success Get Data',
      data: data,
    };
  }

  async createAnggota(
    createAnggotaParams: CreateAnggotaParams,
    foto: Express.Multer.File,
  ) {
    if (!foto) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        status: 'Failed',
        message: 'Please Upload Foto',
      };
    }
    const res = await this.uploadCloudinary.uploadImage(foto).catch(() => {
      throw new BadRequestException('Invalid file type.');
    });
    const newAnggota = this.anggotaRepository.create({
      ...createAnggotaParams,
      foto: res.url,
    });
    await this.anggotaRepository.save(newAnggota);

    return {
      statusCode: HttpStatus.OK,
      status: 'Success',
      message: 'Success Create Data',
    };
  }

  async updateAnggota(
    updateAnggotaParams: UpdateAnggotaParams,
    id: number,
    foto: Express.Multer.File,
  ) {
    if (!foto) {
      const result = await this.anggotaRepository.update(
        { id },
        { ...updateAnggotaParams },
      );
      if (result.affected === 0) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          status: 'Failed',
          message: 'Data Not Found',
        };
      }

      return {
        statusCode: HttpStatus.OK,
        status: 'Success',
        message: 'Success Update Data',
      };
    } else {
      const res = await this.uploadCloudinary.uploadImage(foto).catch(() => {
        throw new BadRequestException('Invalid file type.');
      });
      const result = await this.anggotaRepository.update(
        { id },
        { ...updateAnggotaParams, foto: res.url },
      );
      if (result.affected === 0) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          status: 'Failed',
          message: 'Data Not Found',
        };
      }

      return {
        statusCode: HttpStatus.OK,
        status: 'Success',
        message: 'Success Update Data',
      };
    }
  }

  async deleteAnggota(id: number) {
    const result = await this.anggotaRepository.delete({ id });
    if (result.affected === 0) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        status: 'Failed',
        message: 'Data Not Found',
      };
    }

    return {
      statusCode: HttpStatus.OK,
      status: 'Success',
      message: 'Success Delete Data',
    };
  }
}
