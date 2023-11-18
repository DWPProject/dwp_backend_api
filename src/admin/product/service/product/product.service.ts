import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteAccSeller } from 'recipe/dto/User.dto';
import { Produk } from 'recipe/entities/Produk';
import {
  CreateProductParams,
  UpdateProductParams,
} from 'recipe/utils/Product.utils';
import { RandomStringGenerator } from 'recipe/utils/randomStringGenerator.utils';
import { UploadService } from 'src/cloudinary/service/service.service';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Produk)
    private produkRepository: Repository<Produk>,
    private uploadCloudinary: UploadService,
  ) {}

  async findProductById(deleteAccSeller: DeleteAccSeller) {
    const data = await this.produkRepository.find({
      where: {
        id_penjual: deleteAccSeller.id,
      },
    });

    return data;
  }

  async createProduct(
    createProductParams: CreateProductParams,
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
    const idProduct = RandomStringGenerator();
    const newProduct = this.produkRepository.create({
      id: idProduct,
      jual: false,
      foto: res.url,
      ...createProductParams,
    });

    await this.produkRepository.save(newProduct);

    return {
      statusCode: HttpStatus.OK,
      status: 'Success',
      message: 'Success Create Data',
    };
  }

  async updateProduct(
    updateProductParams: UpdateProductParams,
    id: string,
    foto: Express.Multer.File,
  ) {
    if (!foto) {
      const result = await this.produkRepository.update(
        { id },
        { ...updateProductParams },
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
      const result = await this.produkRepository.update(
        { id },
        { ...updateProductParams, foto: res.url },
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

  async sellProduct(id: string) {
    const result = await this.produkRepository.update({ id }, { jual: true });
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
      message: 'Success Sell Product',
    };
  }
  async unsellProduct(id: string) {
    const result = await this.produkRepository.update({ id }, { jual: false });
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
      message: 'Success unSell Product',
    };
  }

  async getDataSellProduct() {
    const data = await this.produkRepository
      .createQueryBuilder('produk')
      .select([
        'users.id',
        'users.nama_toko',
        'users.profil',
        'users.username',
        'produk.id',
        'produk.nama',
        'produk.foto',
        'produk.harga',
        'produk.stok',
        'produk.kategori',
      ])
      .leftJoin('produk.user', 'users')
      .where('produk.jual = :jual', { jual: true })
      .getMany();

    return {
      statusCode: HttpStatus.OK,
      status: 'Success',
      message: 'Success Get Sell Product',
      data: data,
    };
  }
  async getDataBankProduct() {
    const data = await this.produkRepository
      .createQueryBuilder('produk')
      .select([
        'users.id',
        'users.nama_toko',
        'users.profil',
        'users.username',
        'produk.id',
        'produk.nama',
        'produk.foto',
        'produk.harga',
        'produk.stok',
        'produk.kategori',
      ])
      .leftJoin('produk.user', 'users')
      .where('produk.jual = :jual', { jual: false })
      .getMany();

    return {
      statusCode: HttpStatus.OK,
      status: 'Success',
      message: 'Success Get Bank Product',
      data: data,
    };
  }

  async orderProduct(id: string, stok: number, manager: EntityManager) {
    return manager.transaction(async (transactionalManager) => {
      const result = await transactionalManager.findOne(Produk, {
        where: {
          id: id,
          jual: true,
        },
        lock: {
          mode: 'pessimistic_write',
        },
      });

      if (!result) {
        throw new Error(`Produk dengan ID ${id} tidak ditemukan.`);
      }

      if (result.stok < stok) {
        throw new Error(`Stok produk tidak mencukupi.`);
      }

      result.stok -= stok;

      await transactionalManager.save(Produk, result);
    });
  }

  async deleteProduct(id: string) {
    const result = await this.produkRepository.delete({ id });
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
