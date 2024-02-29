import { Injectable } from "@nestjs/common";
import { CreatePollWDto } from "./dto/create-poll.w.dto";
import { UpdatePollWDto } from "./dto/update-poll.w.dto";

@Injectable()
export class PollWsService {
	create(createPollWDto: CreatePollWDto) {
		return "This action adds a new pollW";
	}

	findAll() {
		return "This action returns all pollWs";
	}

	findOne(id: number) {
		return `This action returns a #${id} pollW`;
	}

	update(id: number, updatePollWDto: UpdatePollWDto) {
		return `This action updates a #${id} pollW`;
	}

	remove(id: number) {
		return `This action removes a #${id} pollW`;
	}
}
