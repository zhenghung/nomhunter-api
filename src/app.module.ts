import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import ConfigModule from "./config/config.module";
import DatabaseModule from "./database/database.module";
import { EntitiesModule } from "./modules/entities/entities.module";
import { ServicesModule } from "./modules/services/services.module";
import { ClientsModule } from "./modules/clients/clients.module";

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    EntitiesModule,
    ServicesModule,
    ClientsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
