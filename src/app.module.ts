import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import ConfigModule from "./config/config.module";
import DatabaseModule from "./database/database.module";
import { EntitiesModule } from "./modules/entities/entities.module";
import { ServicesModule } from "./modules/services/services.module";

@Module({
  imports: [ConfigModule, DatabaseModule, EntitiesModule, ServicesModule],
  controllers: [AppController],
})
export class AppModule {}
