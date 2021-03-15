import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SeasonEntity } from "./season.entity";
import { DateUtil } from "../../common/util/date.util";
import { HttpExceptionsUtil } from "../../common/util/http-exceptions.util";

@Injectable()
export class SeasonEntityService {
  private readonly logger = new Logger(SeasonEntityService.name);

  constructor(
    @InjectRepository(SeasonEntity)
    private readonly seasonEntityRepository: Repository<SeasonEntity>
  ) {}

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
