import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PlayerEntityService } from "../../../entities/player/player.entity.service";
import { TokenRequestInterface } from "../interface/token-request.interface";
import { PlayerEntity } from "../../../entities/player/player.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly playerService: PlayerEntityService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("jwt.secret"),
    });
  }

  async validate(payload: TokenRequestInterface): Promise<PlayerEntity> {
    return this.playerService.getById(payload.sub);
  }
}
