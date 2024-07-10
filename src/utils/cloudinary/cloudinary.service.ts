import { BadRequestException, Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');
@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
    folder: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      console.log(file, folder);
      if (!file.mimetype.startsWith('image')) {
        throw new BadRequestException(
          'Sorry, this file is not an image, please try again',
        );
      }
      const upload = v2.uploader.upload_stream(
        { folder: `ecommerce/${folder}` },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      toStream(file.buffer).pipe(upload);
    });
  }
}
