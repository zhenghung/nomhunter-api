import { Body, Controller, Get, HttpException, HttpStatus, Logger, Param, Post } from "@nestjs/common";
import { CreatePlayerDto } from "./dto/create-player.dto";
import { PlayerEntity } from "./player.entity";
import { PlayerEntityService } from "./player.entity.service";
import { ApiTags } from "@nestjs/swagger";
import { QueryFailedError } from "typeorm";

@ApiTags("PlayerEntity")
@Controller("entities/player")
export class PlayerEntityController {
  private readonly logger = new Logger(PlayerEntityController.name);

  constructor(private readonly playerEntityService: PlayerEntityService) {}

  @Post()
  create(@Body() createPlayerDto: CreatePlayerDto): Promise<PlayerEntity> {
    this.logger.log(`Creating player with email: ${createPlayerDto.email}`);
    return this.playerEntityService
      .create(createPlayerDto)
      .then((player) => {
        this.logger.log(`Player with email ${player.email} successfully created`);
        return player;
      })
      .catch((e) => {
        const errMsg = `Player with email ${createPlayerDto.email} already taken`;
        if (e instanceof QueryFailedError) {
          this.logger.log(errMsg);
        }
        throw new HttpException(errMsg, HttpStatus.BAD_REQUEST);
      });
  }

  @Get()
  findAll(): Promise<PlayerEntity[]> {
    this.logger.log("Fetching all player entities");
    return this.playerEntityService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string): Promise<PlayerEntity> {
    this.logger.log(`Fetching player with id ${id}`);
    return this.playerEntityService.getById(id);
  }
}
