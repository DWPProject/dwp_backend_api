import { Body, Controller, Get, HttpStatus } from '@nestjs/common';
import { ReportDto } from 'recipe/dto/Report.dto';
import { BuyerHistoryService } from 'src/user/buyer-history/service/buyer-history/buyer-history.service';

@Controller('report')
export class ReportController {
  constructor(private buyerHistoryService: BuyerHistoryService) {}

  @Get('/')
  async reportOrderAdmin(@Body() reportDto: ReportDto) {
    try {
      return await this.buyerHistoryService.reportOrder(
        reportDto.id,
        reportDto.start,
        reportDto.end,
      );
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `${error}`,
      };
    }
  }
}
