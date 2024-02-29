import { Injectable } from "@nestjs/common";
import { CreatePollDto } from "./dto/create-poll.dto";
import { PrismaService } from "nestjs-prisma";
import { VoteOnPollDto } from "./dto/vote-on-poll.dto";
import { Request, Response } from "express";
import { randomUUID } from "crypto";
import { redis } from "src/lib/redis";

@Injectable()
export class PollService {
	constructor(readonly prisma: PrismaService) {}

	async create(createPollDto: CreatePollDto) {
		const poll = await this.prisma.poll.create({
			data: {
				title: createPollDto.title,
				options: {
					createMany: {
						data: createPollDto.options.map((option) => {
							return {
								title: option,
							};
						}),
					},
				},
			},
		});

		return { pollId: poll.id };
	}

	async findOne(id: string) {
		const poll = await this.prisma.poll.findUniqueOrThrow({
			where: {
				id,
			},
			include: {
				options: {
					select: {
						id: true,
						title: true,
					},
				},
			},
		});

		const result = await redis.zrange(id, 0, -1, "WITHSCORES");

		const votes: Record<string, number> = result.reduce(
			(obj, row, index) => {
				if (index % 2 === 0) {
					const score = result[index + 1];

					Object.assign(obj, { [row]: Number(score) });
				}

				return obj;
			},
			{} as Record<string, number>,
		);

		console.log(votes);

		return {
			poll: {
				id: poll.id,
				title: poll.title,
				options: poll.options.map((option) => {
					return {
						id: option.id,
						title: option.title,
						score: option.id in votes ? votes[option.id] : 0,
					};
				}),
			},
		};
	}

	async voteOnPoll(
		pollId: string,
		dto: VoteOnPollDto,
		request: Request,
		response: Response,
	) {
		let { sessionId } = request.signedCookies;

		if (sessionId) {
			const userPreviousVoteOnPoll = await this.prisma.vote.findUnique({
				where: {
					sessionId_pollId: {
						sessionId,
						pollId,
					},
				},
			});

			if (
				userPreviousVoteOnPoll &&
				userPreviousVoteOnPoll.pollOptionId !== dto.pollOptionId
			) {
				await this.prisma.vote.delete({
					where: {
						id: userPreviousVoteOnPoll.id,
					},
				});

				await redis.zincrby(pollId, -1, userPreviousVoteOnPoll.pollOptionId);
			} else if (userPreviousVoteOnPoll) {
				return { message: "You have already voted on this poll" };
			}
		}

		if (!sessionId) {
			sessionId = randomUUID();

			response.cookie("sessionId", sessionId, {
				path: "/",
				maxAge: 60 * 60 * 24 * 30, // 30 days
				signed: true,
				httpOnly: true,
			});
		}

		await this.prisma.vote.create({
			data: {
				sessionId,
				pollId,
				pollOptionId: dto.pollOptionId,
			},
		});

		await redis.zincrby(pollId, 1, dto.pollOptionId);

		return;
	}
}
