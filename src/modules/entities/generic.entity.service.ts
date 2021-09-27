import { HttpExceptionsUtil } from "../common/util/http-exceptions.util";
import { DeepPartial, FindManyOptions, Repository } from "typeorm";
import { HttpStatus, Logger } from "@nestjs/common";

export abstract class GenericEntityService<T> {
  protected constructor(
    private readonly repository: Repository<T>,
    protected readonly logger: Logger,
    private readonly entityName: string
  ) {}

  async create(dto: any): Promise<T> {
    return this.repository.save(dto).catch((error) => {
      throw HttpExceptionsUtil.createHttpException(error.message, HttpStatus.BAD_REQUEST, this.logger, error);
    });
  }

  async getById(id: string): Promise<T> {
    return this.repository
      .findOneOrFail(id)
      .catch(HttpExceptionsUtil.genericFindByUUIDErrorHandler(this.entityName, id, this.logger));
  }

  async getByIdNullable(id: string): Promise<T | undefined> {
    if (!id) {
      return undefined;
    }
    return this.repository
      .findOne(id)
      .catch(HttpExceptionsUtil.genericFindByUUIDErrorHandler(this.entityName, id, this.logger));
  }

  async find(conditions: FindManyOptions): Promise<T[]> {
    return this.repository.find(conditions);
  }

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async updateByEntityId(entityId: string, partialEntity: DeepPartial<T>): Promise<T> {
    return this.repository.save({ id: entityId, ...partialEntity });
  }
}
