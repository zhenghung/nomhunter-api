import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository } from "typeorm";
import { FileEntity } from "./file.entity";
import { HttpExceptionsUtil } from "../../common/util/http-exceptions.util";
import { GenericEntityService } from "../generic.entity.service";
import { CreateFileDto } from "./dto/create-file.dto";

@Injectable()
export class FileEntityService extends GenericEntityService<FileEntity> {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileEntityRepository: Repository<FileEntity>
  ) {
    super(fileEntityRepository, new Logger(FileEntityService.name), FileEntity.name);
  }

  async create(createFileDto: CreateFileDto): Promise<FileEntity> {
    return this.fileEntityRepository.save(createFileDto).catch((error) => {
      throw HttpExceptionsUtil.createHttpException(error.message, HttpStatus.BAD_REQUEST, this.logger, error);
    });
  }

  async remove(id: string): Promise<boolean> {
    return this.fileEntityRepository
      .delete(id)
      .catch((error) => {
        throw HttpExceptionsUtil.createHttpException(
          "Something went wrong",
          HttpStatus.INTERNAL_SERVER_ERROR,
          this.logger,
          error
        );
      })
      .then((result: DeleteResult) => {
        if (result.affected == 0) {
          throw HttpExceptionsUtil.createHttpException(
            `FileEntity of id: ${id} does not exist`,
            HttpStatus.NOT_FOUND,
            this.logger
          );
        }
        this.logger.log(`FileEntity of id: ${id} deleted successfully`);
        return true;
      });
  }
}
