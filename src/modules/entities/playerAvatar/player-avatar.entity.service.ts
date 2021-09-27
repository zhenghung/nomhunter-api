import { Injectable, Logger } from "@nestjs/common";
import { GenericEntityService } from "../generic.entity.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PlayerAvatarEntity } from "./player-avatar.entity";
import { Colors } from "../../common/constants/colors";
import { PlayerEntity } from "../player/player.entity";
import { AvatarPoseEntity } from "../avatarPose/avatar-pose.entity";
import { GearEntity } from "../gear/gear.entity";
import { FileEntity } from "../file/file.entity";

@Injectable()
export class PlayerAvatarEntityService extends GenericEntityService<PlayerAvatarEntity> {
  constructor(
    @InjectRepository(PlayerAvatarEntity)
    private readonly playerAvatarEntityRepository: Repository<PlayerAvatarEntity>
  ) {
    super(playerAvatarEntityRepository, new Logger(PlayerAvatarEntityService.name), PlayerAvatarEntity.name);
  }

  async getByPlayerId(playerId: string): Promise<PlayerAvatarEntity> {
    return this.playerAvatarEntityRepository
      .createQueryBuilder("playerAvatar")
      .where("playerAvatar.player.id = :id", { id: playerId })
      .getOne();
  }

  async createStockAvatar(
    player: PlayerEntity,
    pose: AvatarPoseEntity,
    face: GearEntity,
    file: FileEntity
  ): Promise<PlayerAvatarEntity> {
    return this.create({
      player: player,
      pose: pose,
      face: face,
      file: file,
      color: Colors.MANGO_SORBET_200_VALUE,
    });
  }

  async updateByPlayer(
    player: PlayerEntity,
    pose: AvatarPoseEntity,
    face: GearEntity,
    hat: GearEntity,
    weapon: GearEntity,
    color: string
  ): Promise<PlayerAvatarEntity> {
    const playerAvatar: PlayerAvatarEntity = await this.getByPlayerId(player.id);
    return this.updateByEntityId(playerAvatar.id, {
      pose: pose,
      face: face,
      hat: hat,
      weapon: weapon,
      color: color,
    });
  }
}
