import { Module } from '@nestjs/common';
import { PollWsService } from './poll.ws.service';
import { PollWsGateway } from './poll.ws.gateway';

@Module({
  providers: [PollWsGateway, PollWsService],
})
export class PollWsModule {}
