import { IsArray, IsString } from "class-validator";

export class CreatePollDto {
	@IsString()
	title: string;

	@IsArray()
	options: string[];
}
