import { Module } from '@nestjs/common';
import { DefaultController } from './controllers/default.controller';
import ConfigModule from './config/config.module';
import DatabaseModule from './database/database.module';
import { EntitiesModule } from './entities/entities.module';

@Module({
    imports: [
        ConfigModule,
        DatabaseModule,
        EntitiesModule,
    ],
    controllers: [DefaultController],
})
export class AppModule {
}
