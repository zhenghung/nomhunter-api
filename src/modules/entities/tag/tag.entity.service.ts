import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import { HttpExceptionsUtil } from "../../common/util/http-exceptions.util";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TagEntity } from "./tag.entity";
import { GenericEntityService } from "../generic.entity.service";

@Injectable()
export class TagEntityService extends GenericEntityService<TagEntity> {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagEntityRepository: Repository<TagEntity>
  ) {
    super(tagEntityRepository, new Logger(TagEntityService.name), TagEntity.name);
  }

  async getByTagName(tagName: string): Promise<TagEntity> {
    return this.tagEntityRepository.findOneOrFail({ name: tagName }).catch((error) => {
      throw HttpExceptionsUtil.createHttpException("TagEntity", HttpStatus.NOT_FOUND, this.logger, error);
    });
  }
}
