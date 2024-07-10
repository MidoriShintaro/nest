import { Injectable } from '@nestjs/common';
import { CloudinaryService } from './utils/cloudinary/cloudinary.service';

@Injectable()
export class AppService {
  constructor(private cloudinary: CloudinaryService) {}
  async uploadImageToCloudinary(
    file: Express.Multer.File,
    folder: string,
  ): Promise<string> {
    const data = await this.cloudinary.uploadImage(file, folder);
    console.log(data);
    return 'upload image to cloudinary successfully';
  }
  getHello(): string {
    return 'Hello World!';
  }
}
