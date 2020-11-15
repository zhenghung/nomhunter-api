import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../entities/users/users.module';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtConfig } from './jwt.config';

@Module({
    imports: [
        UsersModule,
        PassportModule,
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigService],
            useClass: JwtConfig,
        }),
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    controllers: [AuthController],
})
export class AuthModule {}
