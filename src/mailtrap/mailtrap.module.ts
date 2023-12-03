import { Module } from '@nestjs/common';
import { EmailService } from './service/service.service';

@Module({
  providers: [EmailService],
})
export class MailtrapModule {}
