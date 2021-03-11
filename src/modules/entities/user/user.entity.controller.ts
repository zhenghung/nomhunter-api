import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserEntity } from "./user.entity";
import { UserEntityService } from "./user.entity.service";
import { ApiTags } from "@nestjs/swagger";
import { QueryFailedError } from "typeorm";

@ApiTags("UserEntity")
@Controller("entities/user")
export class UserEntityController {
  private readonly logger = new Logger(UserEntityController.name);

  constructor(private readonly usersService: UserEntityService) {}

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
    this.logger.log("Fetching all user");
    return this.usersService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string): Promise<UserEntity> {
    this.logger.log(`Fetching user with id ${id}`);
    return this.usersService.getById(id);
  }
}
