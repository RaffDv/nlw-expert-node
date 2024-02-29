import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { PollWsService } from './poll.ws.service';
import { CreatePollWDto } from './dto/create-poll.w.dto';
import { UpdatePollWDto } from './dto/update-poll.w.dto';

@WebSocketGateway(4001)
export class PollWsGateway {
  constructor(private readonly pollWsService: PollWsService) {}

  @SubscribeMessage('createPollW')
  create(@MessageBody() createPollWDto: CreatePollWDto) {
    return this.pollWsService.create(createPollWDto);
  }

  @SubscribeMessage('findAllPollWs')
  findAll() {
    return this.pollWsService.findAll();
  }

  @SubscribeMessage('findOnePollW')
  findOne(@MessageBody() id: number) {
    return this.pollWsService.findOne(id);
  }

  @SubscribeMessage('updatePollW')
  update(@MessageBody() updatePollWDto: UpdatePollWDto) {
    return this.pollWsService.update(updatePollWDto.id, updatePollWDto);
  }

  @SubscribeMessage('removePollW')
  remove(@MessageBody() id: number) {
    return this.pollWsService.remove(id);
  }
}
