import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { AxiosAdapter } from './adapters/axios.adapter';

@Module({
  providers: [CommonService, AxiosAdapter],
  exports: [CommonService, AxiosAdapter],
})
export class CommonModule {}
