import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { GlobalDto } from 'recipe/dto/Globa.dto';
import { ChangeOrderStatusDto } from 'recipe/utils/orderProduct';
import { EmailService } from 'src/mailtrap/service/service.service';
import { BuyerHistoryService } from 'src/user/buyer-history/service/buyer-history/buyer-history.service';

@Controller('order')
export class OrderController {
  constructor(
    private buyerHistoryService: BuyerHistoryService,
    private emailService: EmailService,
  ) {}

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
