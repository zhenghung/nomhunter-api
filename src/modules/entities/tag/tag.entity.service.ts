import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import { HttpExceptionsUtil } from "../../common/util/http-exceptions.util";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TagEntity } from "./tag.entity";

@Injectable()
export class TagEntityService {
  private readonly logger = new Logger(TagEntityService.name);

  constructor(
    @InjectRepository(TagEntity)
    private readonly tagEntityRepository: Repository<TagEntity>
  ) {}

  getById(id: string): Promise<TagEntity> {
    return this.tagEntityRepository
      .findOneOrFail(id)
      .catch(
        HttpExceptionsUtil.genericFindByUUIDErrorHandler(
          "TagEntity",
          id,
          this.logger
        )
      );
  }

  async getByTagName(tagName: string): Promise<TagEntity> {
    return this.tagEntityRepository
      .findOneOrFail({ name: tagName })
      .catch((error) => {
        throw HttpExceptionsUtil.createHttpException(
          "TagEntity",
          HttpStatus.NOT_FOUND,
          this.logger,
          error
        );
      });
  }

  findAll(): Promise<TagEntity[]> {
    return this.tagEntityRepository.find();
  }
}
