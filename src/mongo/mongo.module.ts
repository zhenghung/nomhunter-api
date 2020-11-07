import { MongooseModule } from '@nestjs/mongoose';
import ConfigModule from '../config/config.module';
import { MongoConfig } from './mongo.config';

export default MongooseModule.forRootAsync({
    imports: [ConfigModule],
    useClass: MongoConfig,
});
