import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { OverviewDto, ReportDto } from 'recipe/dto/Report.dto';
import { OrderService } from 'src/admin/order/service/order/order.service';
import { RolesMiddleware } from 'src/middleware/roles.middleware';
import { BuyerHistoryService } from 'src/user/buyer-history/service/buyer-history/buyer-history.service';

@Controller('overview')
export class OverviewController {
  constructor(
    private buyerHistoryService: BuyerHistoryService,
    private orderService: OrderService,
  ) {}

  @SetMetadata('roles', ['admin'])
  @UseGuards(RolesMiddleware)
  @Post('/')
  async overviewAdmin(@Body() reportDto: OverviewDto) {
    try {
      const tahun = new Date().getFullYear();
      const januari = new ReportDto();
      januari.start = `${tahun}-01-01`;
      januari.end = `${tahun}-02-01`;
      const jan = await this.buyerHistoryService.reportOrderOverview(
        reportDto.id,
        januari.start,
        januari.end,
      );
      const februari = new ReportDto();
      februari.start = `${tahun}-02-01`;
      februari.end = `${tahun}-03-01`;
      const feb = await this.buyerHistoryService.reportOrderOverview(
        reportDto.id,
        februari.start,
        februari.end,
      );
      const maret = new ReportDto();
      maret.start = `${tahun}-03-01`;
      maret.end = `${tahun}-04-01`;
      const mar = await this.buyerHistoryService.reportOrderOverview(
        reportDto.id,
        maret.start,
        maret.end,
      );
      const april = new ReportDto();
      april.start = `${tahun}-04-01`;
      april.end = `${tahun}-05-01`;
      const apr = await this.buyerHistoryService.reportOrderOverview(
        reportDto.id,
        april.start,
        april.end,
      );
      const mei = new ReportDto();
      mei.start = `${tahun}-05-01`;
      mei.end = `${tahun}-06-01`;
      const may = await this.buyerHistoryService.reportOrderOverview(
        reportDto.id,
        mei.start,
        mei.end,
      );
      const juni = new ReportDto();
      juni.start = `${tahun}-06-01`;
      juni.end = `${tahun}-07-01`;
      const june = await this.buyerHistoryService.reportOrderOverview(
        reportDto.id,
        juni.start,
        juni.end,
      );
      const juli = new ReportDto();
      juli.start = `${tahun}-07-01`;
      juli.end = `${tahun}-08-01`;
      const july = await this.buyerHistoryService.reportOrderOverview(
        reportDto.id,
        juli.start,
        juli.end,
      );
      const agustus = new ReportDto();
      agustus.start = `${tahun}-08-01`;
      agustus.end = `${tahun}-09-01`;
      const aug = await this.buyerHistoryService.reportOrderOverview(
        reportDto.id,
        agustus.start,
        agustus.end,
      );
      const september = new ReportDto();
      september.start = `${tahun}-09-01`;
      september.end = `${tahun}-10-01`;
      const sept = await this.buyerHistoryService.reportOrderOverview(
        reportDto.id,
        september.start,
        september.end,
      );
      const oktober = new ReportDto();
      oktober.start = `${tahun}-10-01`;
      oktober.end = `${tahun}-11-01`;
      const oct = await this.buyerHistoryService.reportOrderOverview(
        reportDto.id,
        oktober.start,
        oktober.end,
      );
      const november = new ReportDto();
      november.start = `${tahun}-11-01`;
      november.end = `${tahun}-12-01`;
      const nov = await this.buyerHistoryService.reportOrderOverview(
        reportDto.id,
        november.start,
        november.end,
      );
      const desember = new ReportDto();
      desember.start = `${tahun}-12-01`;
      desember.end = `${tahun}-12-31`;
      const des = await this.buyerHistoryService.reportOrderOverview(
        reportDto.id,
        desember.start,
        desember.end,
      );
      return {
        januari: jan,
        februari: feb,
        maret: mar,
        april: apr,
        mei: may,
        juni: june,
        juli: july,
        agustus: aug,
        september: sept,
        oktober: oct,
        november: nov,
        desember: des,
        total:
          jan.pendapatan +
          feb.pendapatan +
          mar.pendapatan +
          apr.pendapatan +
          may.pendapatan +
          june.pendapatan +
          july.pendapatan +
          aug.pendapatan +
          sept.pendapatan +
          oct.pendapatan +
          nov.pendapatan +
          des.pendapatan,
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `${error}`,
      };
    }
  }

  @SetMetadata('roles', ['admin'])
  @UseGuards(RolesMiddleware)
  @Post('/populer')
  async populerOrder(@Body() overviewDto: OverviewDto) {
    try {
      return await this.orderService.getPopulerProduk(overviewDto.id);
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `${error}`,
      };
    }
  }
}
