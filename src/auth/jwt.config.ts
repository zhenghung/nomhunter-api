import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt/dist/interfaces/jwt-module-options.interface';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtConfig implements JwtOptionsFactory {
    constructor(private readonly configService: ConfigService) {}

    createJwtOptions(): Promise<JwtModuleOptions> | JwtModuleOptions {
        return {
            secret: this.configService.get<string>('jwt.secret'),
            signOptions: { expiresIn: '60s' },
        };
    }
}
