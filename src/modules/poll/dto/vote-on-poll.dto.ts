import { IsString, IsUUID } from "class-validator";

export class VoteOnPollDto {
	@IsUUID()
	@IsString()
	pollOptionId: string;
}
