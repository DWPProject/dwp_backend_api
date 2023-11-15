import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { GlobalDto } from 'recipe/dto/Globa.dto';
import { ChangeOrderStatusDto } from 'recipe/utils/orderProduct';
import { BuyerHistoryService } from 'src/user/buyer-history/service/buyer-history/buyer-history.service';
import { WhatsAppService } from 'src/whatsapp/services/services.service';

@Controller('order')
export class OrderController {
  constructor(
    private buyerHistoryService: BuyerHistoryService,
    private whatappService: WhatsAppService,
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

  @Post('/finish')
  async onGoingOrder(@Body() globaDto: GlobalDto) {
    try {
      return await this.buyerHistoryService.finishOrder(globaDto.id);
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `${error}`,
      };
    }
  }

  @Get('/sendMessage')
  async messageWa() {
    const to = '+6287775440461'; // Ganti dengan nomor tujuan Anda
    const message = 'Halo dari Nest.js!'; // Ganti dengan pesan Anda

    const result = await this.whatappService.sendInitialMessage(to, message);

    return { success: result };
  }
}
