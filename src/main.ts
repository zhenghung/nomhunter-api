import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import express from "express";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // Serve Static Files
  app.use(express.static("public"));

  // Swagger Generator
  const options = new DocumentBuilder()
    .setTitle("NomHunter API")
    .setDescription("NomHunter API documentation")
    .setVersion("3.0.3")
    .addBearerAuth({
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
    })
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("/", app, document);

  const port: number = config.get<number>("http.port");
  await app.listen(port, "0.0.0.0");
  // eslint-disable-next-line no-console
  console.log(`Application is running on: ${await app.getUrl()}`);
}

void bootstrap();
