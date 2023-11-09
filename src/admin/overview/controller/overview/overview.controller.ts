import { Body, Controller, Get, HttpStatus } from '@nestjs/common';
import ReportDto from 'recipe/dto/Report.dto';
import { BuyerHistoryService } from 'src/user/buyer-history/service/buyer-history/buyer-history.service';

@Controller('overview')
export class OverviewController {
  constructor(private buyerHistoryService: BuyerHistoryService) {}

  @Get('overview')
  async overviewAdmin(@Body() reportDto: ReportDto) {
    try {
      const januari = new ReportDto();
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
