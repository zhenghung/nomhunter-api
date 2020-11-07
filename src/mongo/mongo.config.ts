import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';

@Injectable()
export class MongoConfig implements MongooseOptionsFactory {
    private readonly config: ConfigService;

    constructor(config: ConfigService) {
        this.config = config;
    }

    public createMongooseOptions(): MongooseModuleOptions {
        const dbType: string = this.config.get('database.type');
        const dbHost: string = this.config.get('database.host');
        const dbPort: string = this.config.get('database.host');
        const dbName: string = this.config.get('database.database');
        return {
            uri: `${dbType}://${dbHost}:${dbPort}/${dbName}`,
        };
    }
}
