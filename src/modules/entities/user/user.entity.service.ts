import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, UpdateResult } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserEntity } from "./user.entity";
import { HttpExceptionsUtil } from "../../common/util/http-exceptions.util";

@Injectable()
export class UserEntityService {
  private readonly logger = new Logger(UserEntityService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  async getById(id: string): Promise<UserEntity> {
    return await this.usersRepository
      .findOneOrFail(id)
      .catch(
        HttpExceptionsUtil.genericFindByUUIDErrorHandler(
          "User",
          id,
          this.logger
        )
      );
  }

  async getByEmail(email: string): Promise<UserEntity> {
    return await this.usersRepository
      .findOneOrFail({ email })
      .catch((error: Error) => {
        throw HttpExceptionsUtil.createHttpException(
          `User of email: ${email} does not exist`,
          HttpStatus.NOT_FOUND,
          this.logger,
          error
        );
      });
  }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    return await this.usersRepository.save(createUserDto);
  }

  async updateProfilePic(userId: string, imageId: string): Promise<boolean> {
    return await this.usersRepository
      .update({ id: userId }, { profilePic: imageId })
      .then((updateResult: UpdateResult) => {
        return updateResult.affected == 1;
      });
  }
}
