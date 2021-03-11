import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { HttpExceptionsUtil } from "../../common/util/http-exceptions.util";
import { PlayerBadgeEntity } from "./player-badge.entity";
import { CreatePlayerBadgeDto } from "./dto/create-player-badge.dto";

@Injectable()
export class PlayerBadgeEntityService {
  private readonly logger = new Logger(PlayerBadgeEntityService.name);

  constructor(
    @InjectRepository(PlayerBadgeEntity)
    private readonly playerBadgeEntityRepository: Repository<PlayerBadgeEntity>
  ) {}

  create(
    createPlayerBadgesDto: CreatePlayerBadgeDto
  ): Promise<PlayerBadgeEntity> {
    return this.playerBadgeEntityRepository.save(createPlayerBadgesDto);
  }

  getById(id: string): Promise<PlayerBadgeEntity> {
    return this.playerBadgeEntityRepository.findOneOrFail(id).catch(() => {
      throw HttpExceptionsUtil.genericFindByUUIDErrorHandler(
        "PlayerBadgeEntity",
        id,
        this.logger
      );
    });
  }
}
