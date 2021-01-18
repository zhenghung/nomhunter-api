import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserEntity } from "./user.entity";
import { HttpUtil } from "../../util/http.util";

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

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
      .catch(HttpUtil.genericFindByUUIDErrorHandler("User", id, this.logger));
  }

  async getByEmail(email: string): Promise<UserEntity> {
    return await this.usersRepository
      .findOneOrFail({ email })
      .catch((error: Error) => {
        throw HttpUtil.createHttpException(
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

  async remove(id: string): Promise<boolean> {
    return await this.usersRepository
      .delete(id)
      .catch((error) => {
        throw HttpUtil.createHttpException(
          "Something went wrong",
          HttpStatus.INTERNAL_SERVER_ERROR,
          this.logger,
          error
        );
      })
      .then((result: DeleteResult) => {
        if (result.affected == 0) {
          throw HttpUtil.createHttpException(
            `User of id: ${id} does not exist`,
            HttpStatus.NOT_FOUND,
            this.logger
          );
        }
        this.logger.log(`User of id: ${id} deleted successfully`);
        return true;
      });
  }
}
