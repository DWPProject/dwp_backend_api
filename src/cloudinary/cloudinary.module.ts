import { Module } from '@nestjs/common';
import { CloudinaryProvider } from './provider/provider';
import { UploadService } from './service/service.service';

@Module({
  providers: [UploadService, CloudinaryProvider],
  exports: [UploadService, CloudinaryProvider],
})
export class CloudinaryModule {}
