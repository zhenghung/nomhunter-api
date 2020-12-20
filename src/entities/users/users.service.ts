import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./user.entity";
import { EntityNotFoundError } from "typeorm/error/EntityNotFoundError";
import { HttpUtil } from "../../util/http.util";

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async getById(id: string): Promise<User> {
    return await this.usersRepository
      .findOneOrFail(id)
      .catch((error: Error) => {
        if (error instanceof EntityNotFoundError) {
          throw HttpUtil.createHttpException(
            `User of id: ${id} does not exist`,
            HttpStatus.NOT_FOUND,
            this.logger,
            error
          );
        } else {
          throw HttpUtil.createHttpException(
            `${id} is not a UUID`,
            HttpStatus.BAD_REQUEST,
            this.logger,
            error
          );
        }
      });
  }

  async getByEmail(email: string): Promise<User> {
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

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new User();
    newUser.email = createUserDto.email;
    newUser.password = createUserDto.password;
    newUser.firstName = createUserDto.firstName;
    newUser.lastName = createUserDto.lastName;
    await this.usersRepository.save(newUser);
    return newUser;
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
