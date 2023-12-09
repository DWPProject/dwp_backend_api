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

@Controller('report')
export class ReportSellerController {
  constructor(
    private buyerHistoryService: BuyerHistoryService,
    private orderService: OrderService,
  ) {}

  @SetMetadata('roles', ['penjual'])
  @UseGuards(RolesMiddleware)
  @Post('/')
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

  @SetMetadata('roles', ['penjual'])
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
