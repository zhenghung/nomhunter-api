import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, UpdateResult } from "typeorm";
import { PlayerEntity } from "./player.entity";
import { HttpExceptionsUtil } from "../../common/util/http-exceptions.util";
import { GenericEntityService } from "../generic.entity.service";

@Injectable()
export class PlayerEntityService extends GenericEntityService<PlayerEntity> {
  constructor(
    @InjectRepository(PlayerEntity)
    private readonly playerEntityRepository: Repository<PlayerEntity>
  ) {
    super(
      playerEntityRepository,
      new Logger(PlayerEntityService.name),
      PlayerEntity.name
    );
  }

  async getByEmail(email: string): Promise<PlayerEntity> {
    return await this.playerEntityRepository
      .findOneOrFail({ email })
      .catch((error: Error) => {
        throw HttpExceptionsUtil.createHttpException(
          `Player of email: ${email} does not exist`,
          HttpStatus.NOT_FOUND,
          this.logger,
          error
        );
      });
  }

  async updateProfilePic(playerId: string, imageId: string): Promise<boolean> {
    return await this.playerEntityRepository
      .update({ id: playerId }, { profilePic: imageId })
      .then((updateResult: UpdateResult) => {
        return updateResult.affected == 1;
      });
  }
}
