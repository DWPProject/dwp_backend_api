import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { GlobalDto } from 'recipe/dto/Globa.dto';
import { RolesMiddleware } from 'src/middleware/roles.middleware';
import { BuyerHistoryService } from 'src/user/buyer-history/service/buyer-history/buyer-history.service';

@Controller('history')
export class HistoryController {
  constructor(private buyerHistoryService: BuyerHistoryService) {}

  @SetMetadata('roles', ['user'])
  @UseGuards(RolesMiddleware)
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

  @SetMetadata('roles', ['user'])
  @UseGuards(RolesMiddleware)
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

  @SetMetadata('roles', ['user'])
  @UseGuards(RolesMiddleware)
  @Post('/onproses')
  async getDataHistoryOnProses(@Body() globalDto: GlobalDto) {
    try {
      return await this.buyerHistoryService.orderHistoryNotProses(globalDto.id);
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `${error}`,
      };
    }
  }

  @SetMetadata('roles', ['user'])
  @UseGuards(RolesMiddleware)
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
