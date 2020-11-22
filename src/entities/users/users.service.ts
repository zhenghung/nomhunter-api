import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./user.entity";
import { EntityNotFoundError } from "typeorm/error/EntityNotFoundError";

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
          throw this.createHttpException(
            `User of id: ${id} does not exist`,
            HttpStatus.NOT_FOUND,
            error
          );
        } else {
          throw this.createHttpException(
            `${id} is not a UUID`,
            HttpStatus.BAD_REQUEST,
            error
          );
        }
      });
  }

  async getByEmail(email: string): Promise<User> {
    return await this.usersRepository
      .findOneOrFail({ email })
      .catch((error: Error) => {
        throw this.createHttpException(
          `User of email: ${email} does not exist`,
          HttpStatus.NOT_FOUND,
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

  async remove(id: string): Promise<boolean> {
    return await this.usersRepository
      .delete(id)
      .catch((error) => {
        throw this.createHttpException(
          "Something went wrong",
          HttpStatus.INTERNAL_SERVER_ERROR,
          error
        );
      })
      .then((result: DeleteResult) => {
        if (result.affected == 0) {
          throw this.createHttpException(
            `User of id: ${id} does not exist`,
            HttpStatus.NOT_FOUND
          );
        }
        this.logger.log(`User of id: ${id} deleted successfully`);
        return true;
      });
  }

  private createHttpException(
    errorMsg: string,
    httpStatus: HttpStatus,
    error?: Error
  ): HttpException {
    if (error) {
      this.logger.log(error.message);
    }
    this.logger.log(errorMsg);
    throw new HttpException(errorMsg, httpStatus);
  }
}
