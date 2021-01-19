import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository } from "typeorm";
import { FileEntity } from "./file.entity";
import { HttpExceptionsUtil } from "../../common/util/http-exceptions.util";
import { CreateFileDto } from "./dto/create-file.dto";

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);

  constructor(
    @InjectRepository(FileEntity)
    private readonly filesRepository: Repository<FileEntity>
  ) {}

  async getById(id: string): Promise<FileEntity> {
    return await this.filesRepository
      .findOneOrFail(id)
      .catch(
        HttpExceptionsUtil.genericFindByUUIDErrorHandler(
          "FileEntity",
          id,
          this.logger
        )
      );
  }

  async create(createFileDto: CreateFileDto): Promise<FileEntity> {
    return await this.filesRepository.save(createFileDto);
  }

  async remove(id: string): Promise<boolean> {
    return await this.filesRepository
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
