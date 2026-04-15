import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import { createServer } from "node:net";
import { join } from "node:path";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true
    })
  );
  app.useStaticAssets(join(process.cwd(), "public"));

  const requestedPort = Number(process.env.PORT || 3000);
  const port = await findAvailablePort(requestedPort);
  await app.listen(port);
  if (port !== requestedPort) {
    console.warn(`Porta ${requestedPort} ocupada. Usando ${port}.`);
  }
  console.log(`WililiDash rodando em http://localhost:${port}`);
}

function findAvailablePort(port: number): Promise<number> {
  return new Promise((resolve) => {
    const server = createServer();

    server.once("error", () => {
      resolve(findAvailablePort(port + 1));
    });

    server.once("listening", () => {
      server.close(() => resolve(port));
    });

    server.listen(port);
  });
}

bootstrap();
