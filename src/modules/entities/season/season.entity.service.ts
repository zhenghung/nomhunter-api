import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SeasonEntity } from "./season.entity";
import { DateUtil } from "../../common/util/date.util";
import { HttpExceptionsUtil } from "../../common/util/http-exceptions.util";
import { GenericEntityService } from "../generic.entity.service";

@Injectable()
export class SeasonEntityService extends GenericEntityService<SeasonEntity> {
  constructor(
    @InjectRepository(SeasonEntity)
    private readonly seasonEntityRepository: Repository<SeasonEntity>
  ) {
    super(
      seasonEntityRepository,
      new Logger(SeasonEntityService.name),
      SeasonEntity.name
    );
  }

  async createSeason(startDate?: Date): Promise<SeasonEntity> {
    this.logger.log("Creating Season Entity");
    return this.seasonEntityRepository.save({
      startDate: startDate ? startDate : new Date(),
    });
  }

  async getSeason(date?: Date): Promise<SeasonEntity> {
    return this.seasonEntityRepository
      .findOneOrFail({
        where: {
          startDate: DateUtil.beforeDate(date ? date : new Date()),
        },
        order: {
          startDate: "DESC",
        },
      })
      .catch((error: Error) => {
        throw HttpExceptionsUtil.createHttpException(
          `No season at current date: ${date} exist`,
          HttpStatus.NOT_FOUND,
          this.logger,
          error
        );
      });
  }
}
