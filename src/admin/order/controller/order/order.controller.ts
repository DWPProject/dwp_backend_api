import { Controller, Get, HttpStatus } from '@nestjs/common';
import { BuyerHistoryService } from 'src/user/buyer-history/service/buyer-history/buyer-history.service';

@Controller('order')
export class OrderController {
  constructor(private buyerHistoryService: BuyerHistoryService) {}

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
}
