import { Body, Controller, Get, HttpStatus } from '@nestjs/common';
import { GlobalDto } from 'recipe/dto/Globa.dto';
import { BuyerHistoryService } from 'src/user/buyer-history/service/buyer-history/buyer-history.service';

@Controller('history')
export class HistoryController {
  constructor(private buyerHistoryService: BuyerHistoryService) {}

  @Get('/decline')
  async getDataHistoryDecline(@Body() globalDto: GlobalDto) {
    try {
      return await this.buyerHistoryService.declineOrder(globalDto.id);
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `${error}`,
      };
    }
  }
  @Get('/accept')
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
  @Get('/ongoing')
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
