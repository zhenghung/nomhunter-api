import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { HttpExceptionsUtil } from "../../common/util/http-exceptions.util";
import { UserBadgeEntity } from "./user-badge.entity";
import { CreateUserBadgeDto } from "./dto/create-user-badge.dto";

@Injectable()
export class UserBadgesService {
  private readonly logger = new Logger(UserBadgesService.name);

  constructor(
    @InjectRepository(UserBadgeEntity)
    private readonly userBadgeEntityRepository: Repository<UserBadgeEntity>
  ) {}

  create(createUserBadgesDto: CreateUserBadgeDto): Promise<UserBadgeEntity> {
    return this.userBadgeEntityRepository.save(createUserBadgesDto);
  }

  getById(id: string): Promise<UserBadgeEntity> {
    return this.userBadgeEntityRepository.findOneOrFail(id).catch(() => {
      throw HttpExceptionsUtil.genericFindByUUIDErrorHandler(
        "UserBadgeEntity",
        id,
        this.logger
      );
    });
  }
}
