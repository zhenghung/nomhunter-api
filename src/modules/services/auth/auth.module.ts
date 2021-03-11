import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserEntityModule } from "../../entities/user/user.entity.module";
import { AuthController } from "./auth.controller";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { JwtConfig } from "../../../config/jwt.config";

@Module({
  imports: [
    UserEntityModule,
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
