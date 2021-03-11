import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UserEntityService } from "../../../entities/user/user.entity.service";
import { TokenRequestInterface } from "../interface/token-request.interface";
import { UserEntity } from "../../../entities/user/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserEntityService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("jwt.secret"),
    });
  }

  async validate(payload: TokenRequestInterface): Promise<UserEntity> {
    return this.userService.getById(payload.sub);
  }
}
