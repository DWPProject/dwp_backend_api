import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Produk } from 'recipe/entities/Produk';
import {
  CreateProductParams,
  UpdateProductParams,
} from 'recipe/utils/Product.utils';
import { RandomStringGenerator } from 'recipe/utils/randomStringGenerator.utils';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Produk) private produkRepository: Repository<Produk>,
  ) {}

  async createProduct(createProductParams: CreateProductParams) {
    const idProduct = RandomStringGenerator();
    const newProduct = this.produkRepository.create({
      id: idProduct,
      jual: false,
      ...createProductParams,
    });

    await this.produkRepository.save(newProduct);

    return {
      statusCode: HttpStatus.OK,
      status: 'Success',
      message: 'Success Create Data',
    };
  }

  async updateProduct(updateProductParams: UpdateProductParams, id: string) {
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

  async getDataSellProduct() {
    const data = await this.produkRepository.find({
      where: {
        jual: true,
      },
    });

    return {
      statusCode: HttpStatus.OK,
      status: 'Success',
      message: 'Success Get Sell Product',
      data: data,
    };
  }
  async getDataBankProduct() {
    const data = await this.produkRepository.find({
      where: {
        jual: false,
      },
    });

    return {
      statusCode: HttpStatus.OK,
      status: 'Success',
      message: 'Success Get Bank Product',
      data: data,
    };
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
