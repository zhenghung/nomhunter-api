import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  constructor(private readonly config: ConfigService) {}

  createTypeOrmOptions(): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
    return {
      type: this.config.get<never>("database.type"),
      host: this.config.get("database.host"),
      port: this.config.get("database.port"),
      username: this.config.get("database.username"),
      password: this.config.get<never>("database.password"),
      database: this.config.get<never>("database.database"),
      autoLoadEntities: true,
      synchronize: true,
      namingStrategy: new SnakeNamingStrategy(),
    };
  }
}
