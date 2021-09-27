import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Get, Logger, Post, Query } from "@nestjs/common";
import { ApiImplicitQuery } from "@nestjs/swagger/dist/decorators/api-implicit-query.decorator";
import { SeasonEntityService } from "./season.entity.service";
import { CreateSeasonDto } from "./dto/create-season.dto";
import { SeasonEntity } from "./season.entity";
import { OptionalDatePipe } from "../../common/pipes/optional-date.pipe";

@ApiTags("SeasonEntity")
@Controller("entities/season")
export class SeasonEntityController {
  private readonly logger = new Logger(SeasonEntityController.name);

  constructor(private readonly seasonEntityService: SeasonEntityService) {}

  @Post()
  create(@Body() createSeasonReq: CreateSeasonDto): Promise<SeasonEntity> {
    this.logger.log(`Creating season with startDate: ${createSeasonReq.startDate}`);
    return this.seasonEntityService.createSeason(createSeasonReq.startDate).then((season: SeasonEntity) => {
      this.logger.log(`Season with id ${season.id} successfully created`);
      return season;
    });
  }

  @ApiImplicitQuery({
    name: "date",
    required: false,
    type: String,
  })
  @ApiOperation({ summary: "Fetch Season" })
  @ApiOkResponse({ description: "Season retrieved successfully" })
  @Get()
  findOne(@Query("date", OptionalDatePipe) date?: Date): Promise<SeasonEntity> {
    if (date) {
      this.logger.log(`Fetching season for date: ${date}`);
    } else {
      this.logger.log(`Fetching season for current date: ${new Date()}`);
    }
    return this.seasonEntityService.getSeason(date);
  }
}
