import { Module } from '@nestjs/common';
import { DefaultController } from './controllers/default.controller';
import ConfigModule from './config/config.module';
import { AccountsModule } from './models/accounts/accounts.module';
import MongoModule from './mongo/mongo.module';

@Module({
    imports: [
        ConfigModule,
        MongoModule,
        AccountsModule,
    ],
    controllers: [DefaultController],
})
export class AppModule {
}
