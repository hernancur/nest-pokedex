import {
  // ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import mongoose from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: string) {
    try {
      return new mongoose.Types.ObjectId(value);
    } catch (e) {
      throw new BadRequestException('Invalid mongo ID');
    }
  }
}
