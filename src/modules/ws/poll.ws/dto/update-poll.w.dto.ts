import { PartialType } from '@nestjs/mapped-types';
import { CreatePollWDto } from './create-poll.w.dto';

export class UpdatePollWDto extends PartialType(CreatePollWDto) {
  id: number;
}
