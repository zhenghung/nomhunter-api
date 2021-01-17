import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserEntity } from "./user.entity";
import { UsersService } from "./users.service";
import { ApiTags } from "@nestjs/swagger";
import { QueryFailedError } from "typeorm";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    this.logger.log(`Creating user with email: ${createUserDto.email}`);
    return this.usersService
      .create(createUserDto)
      .then((user) => {
        this.logger.log(`User with email ${user.email} successfully created`);
        return user;
      })
      .catch((e) => {
        const errMsg = `User with email ${createUserDto.email} already taken`;
        if (e instanceof QueryFailedError) {
          this.logger.log(errMsg);
        }
        throw new HttpException(errMsg, HttpStatus.BAD_REQUEST);
      });
  }

  @Get()
  findAll(): Promise<UserEntity[]> {
    this.logger.log("Fetching all users");
    return this.usersService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string): Promise<UserEntity> {
    this.logger.log(`Fetching user with id ${id}`);
    return this.usersService.getById(id);
  }

  @Delete(":id")
  remove(@Param("id") id: string): Promise<void> {
    this.logger.log(`Deleting user with id ${id}`);
    return this.usersService
      .remove(id)
      .then(() => this.logger.log(`User with id ${id} successfully deleted`));
  }
}
