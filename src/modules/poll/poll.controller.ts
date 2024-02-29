import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { PollService } from './poll.service';
import { CreatePollDto } from './dto/create-poll.dto';
import { VoteOnPollDto } from './dto/vote-on-poll.dto';
import { Request, Response } from 'express';

@Controller('poll')
export class PollController {
  constructor(private readonly pollService: PollService) {}

  @Post()
  create(@Body() createPollDto: CreatePollDto ) {
    return this.pollService.create(createPollDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pollService.findOne(id);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('/:id/vote')
  voteOnPoll(@Param('id') id: string,@Body() dto: VoteOnPollDto,@Req() request: Request,@Res({ passthrough: true }) response: Response) {
    return this.pollService.voteOnPoll(id,dto,request,response);
  }

}
