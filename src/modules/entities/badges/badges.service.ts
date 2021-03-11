import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BadgeEntity } from "./badge.entity";
import { CreateBadgeDto } from "./dto/create-badge.dto";
import { HttpExceptionsUtil } from "../../common/util/http-exceptions.util";

@Injectable()
export class BadgesService {
  private readonly logger = new Logger(BadgesService.name);

  constructor(
    @InjectRepository(BadgeEntity)
    private readonly badgeEntityRepository: Repository<BadgeEntity>
  ) {}

  create(createBadgeDto: CreateBadgeDto): Promise<BadgeEntity> {
    return this.badgeEntityRepository.save(createBadgeDto);
  }

  getById(id: string): Promise<BadgeEntity> {
    return this.badgeEntityRepository.findOneOrFail(id).catch(() => {
      throw HttpExceptionsUtil.genericFindByUUIDErrorHandler(
        "BadgeEntity",
        id,
        this.logger
      );
    });
  }

  findAll(): Promise<BadgeEntity[]> {
    return this.badgeEntityRepository.find();
  }
}
