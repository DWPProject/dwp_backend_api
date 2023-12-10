import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { GlobalDto } from 'recipe/dto/Globa.dto';
import { ChangeOrderStatusDto } from 'recipe/utils/orderProduct';
import { EmailService } from 'src/mailtrap/service/service.service';
import { RolesMiddleware } from 'src/middleware/roles.middleware';
import { BuyerHistoryService } from 'src/user/buyer-history/service/buyer-history/buyer-history.service';

@Controller('order')
export class OrderController {
  constructor(private buyerHistoryService: BuyerHistoryService) {}

  @SetMetadata('roles', ['admin'])
  @UseGuards(RolesMiddleware)
  @Get('/')
  async getDataOrderAdmin() {
    try {
      return await this.buyerHistoryService.getDataOrderAdmin();
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `${error}`,
      };
    }
  }

  @SetMetadata('roles', ['admin'])
  @UseGuards(RolesMiddleware)
  @Post('/status')
  async changeStatusOrder(@Body() changeOrderStatusDto: ChangeOrderStatusDto) {
    try {
      return await this.buyerHistoryService.changeOrderStatus(
        changeOrderStatusDto.id,
        changeOrderStatusDto.status,
      );
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `${error}`,
      };
    }
  }

  @SetMetadata('roles', ['admin'])
  @UseGuards(RolesMiddleware)
  @Post('/aprove')
  async aproveOrder(@Body() globaDto: GlobalDto) {
    try {
      return await this.buyerHistoryService.aproveOrder(globaDto.id);
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `${error}`,
      };
    }
  }

  @SetMetadata('roles', ['admin'])
  @UseGuards(RolesMiddleware)
  @Post('/decline')
  async declineOrder(@Body() globaDto: GlobalDto) {
    try {
      return await this.buyerHistoryService.declineOrder(globaDto.id);
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `${error}`,
      };
    }
  }
}
