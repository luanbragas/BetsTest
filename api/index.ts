import "reflect-metadata";
import express = require("express");
import type { Express, Request, Response } from "express";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import { AppModule } from "../src/app.module";

let cachedServer: Express | null = null;

async function bootstrapServer(): Promise<Express> {
  if (cachedServer) return cachedServer;

  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    logger: ["error", "warn", "log"]
  });

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true
    })
  );

  await app.init();
  cachedServer = server;
  return server;
}

export default async function handler(request: Request, response: Response) {
  const server = await bootstrapServer();
  return server(request, response);
}
