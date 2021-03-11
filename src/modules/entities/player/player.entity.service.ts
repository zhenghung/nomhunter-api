import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, UpdateResult } from "typeorm";
import { CreatePlayerDto } from "./dto/create-player.dto";
import { PlayerEntity } from "./player.entity";
import { HttpExceptionsUtil } from "../../common/util/http-exceptions.util";

@Injectable()
export class PlayerEntityService {
  private readonly logger = new Logger(PlayerEntityService.name);

  constructor(
    @InjectRepository(PlayerEntity)
    private readonly playersRepository: Repository<PlayerEntity>
  ) {}

  async findAll(): Promise<PlayerEntity[]> {
    return this.playersRepository.find();
  }

  async getById(id: string): Promise<PlayerEntity> {
    return await this.playersRepository
      .findOneOrFail(id)
      .catch(
        HttpExceptionsUtil.genericFindByUUIDErrorHandler(
          "Player",
          id,
          this.logger
        )
      );
  }

  async getByEmail(email: string): Promise<PlayerEntity> {
    return await this.playersRepository
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

  async create(createPlayerDto: CreatePlayerDto): Promise<PlayerEntity> {
    return await this.playersRepository.save(createPlayerDto);
  }

  async updateProfilePic(playerId: string, imageId: string): Promise<boolean> {
    return await this.playersRepository
      .update({ id: playerId }, { profilePic: imageId })
      .then((updateResult: UpdateResult) => {
        return updateResult.affected == 1;
      });
  }
}
