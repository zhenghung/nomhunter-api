import { Module } from '@nestjs/common';
import { DefaultController } from './controllers/default.controller';
import ConfigModule from './config/config.module';
import MongoModule from './mongo/mongo.module';
import { ModelsModule } from './models/models.module';

@Module({
    imports: [
        ConfigModule,
        MongoModule,
        ModelsModule,
    ],
    controllers: [DefaultController],
})
export class AppModule {
}
