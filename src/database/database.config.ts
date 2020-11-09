import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
    private readonly config: ConfigService;

    constructor(config: ConfigService) {
        this.config = config;
    }

    createTypeOrmOptions(): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
        const dbType: never = this.config.get('database.type');
        const dbPassword: never = this.config.get('database.password');
        const dbName: never = this.config.get('database.database');
        return {
            type: dbType,
            host: this.config.get('database.host'),
            port: this.config.get('database.port'),
            username: this.config.get('database.username'),
            password: dbPassword,
            database: dbName,
            autoLoadEntities: true,
            synchronize: true,
        };
    }
}
