import { BadRequestException, Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class UploadService {
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;

    if (!Buffer.isBuffer(file.buffer)) {
      throw new BadRequestException(
        'File buffer is not a valid Buffer instance',
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new BadRequestException('File size exceeds the limit');
    }

    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      });

      toStream(file.buffer).pipe(upload);
    });
  }
}
