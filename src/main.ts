import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import { PrismaClientExceptionFilter } from "nestjs-prisma";
import { WsAdapter } from "@nestjs/platform-ws";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// class validator
	app.useGlobalPipes(new ValidationPipe());

	// cookies
	app.use(cookieParser("polls-nlw-hfuewfuvsuvhes"));

	// nestjs-prisma exceptions
	const { httpAdapter } = app.get(HttpAdapterHost);
	app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

	app.useWebSocketAdapter(new WsAdapter(app));

	await app.listen(4000);
}
bootstrap();
