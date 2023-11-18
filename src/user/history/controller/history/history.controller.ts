import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { GlobalDto } from 'recipe/dto/Globa.dto';
import { BuyerHistoryService } from 'src/user/buyer-history/service/buyer-history/buyer-history.service';

@Controller('history')
export class HistoryController {
  constructor(private buyerHistoryService: BuyerHistoryService) {}

  @Post('/decline')
  async getDataHistoryDecline(@Body() globalDto: GlobalDto) {
    try {
      return await this.buyerHistoryService.orderHistoryDecline(globalDto.id);
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `${error}`,
      };
    }
  }
  @Post('/accept')
  async getDataHistoryAccept(@Body() globalDto: GlobalDto) {
    try {
      return await this.buyerHistoryService.orderHistoryFinish(globalDto.id);
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `${error}`,
      };
    }
  }
  @Post('/ongoing')
  async getDataHistoryOnGoing(@Body() globalDto: GlobalDto) {
    try {
      return await this.buyerHistoryService.orderHistoryOnGoing(globalDto.id);
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `${error}`,
      };
    }
  }
}
