import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { GlobalDto, GlobalDtoFinish } from 'recipe/dto/Globa.dto';
import { ChangeOrderStatusDto } from 'recipe/utils/orderProduct';
import { RolesMiddleware } from 'src/middleware/roles.middleware';
import { BuyerHistoryService } from 'src/user/buyer-history/service/buyer-history/buyer-history.service';

@Controller('order')
export class OrderSellerController {
  constructor(private buyerHistoryService: BuyerHistoryService) {}

  @SetMetadata('roles', ['penjual'])
  @UseGuards(RolesMiddleware)
  @Post('/')
  async getDataOrderSeller(@Body() globalDto: GlobalDto) {
    try {
      return await this.buyerHistoryService.getDataOrderSeller(globalDto.id);
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `${error}`,
      };
    }
  }

  @SetMetadata('roles', ['penjual'])
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

  @SetMetadata('roles', ['penjual'])
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

  @SetMetadata('roles', ['penjual'])
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

  @SetMetadata('roles', ['penjual'])
  @UseGuards(RolesMiddleware)
  @Post('/finish')
  async onGoingOrder(@Body() globaDto: GlobalDtoFinish) {
    try {
      return await this.buyerHistoryService.finishOrder(
        globaDto.idSeller,
        globaDto.idOrder,
      );
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `${error}`,
      };
    }
  }
}
