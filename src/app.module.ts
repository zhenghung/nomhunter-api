import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import ConfigModule from "./config/config.module";
import DatabaseModule from "./database/database.module";
import { EntitiesModule } from "./entities/entities.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [ConfigModule, DatabaseModule, EntitiesModule, AuthModule],
  controllers: [AppController],
})
export class AppModule {}
