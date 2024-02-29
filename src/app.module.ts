import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PollModule } from "./modules/poll/poll.module";
import { PrismaModule } from "nestjs-prisma";
import { PollWsModule } from './modules/ws/poll.ws/poll.ws.module';

@Module({
	imports: [
		PollModule,
		PrismaModule.forRoot({
			isGlobal: true,
		}),
		PollWsModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
