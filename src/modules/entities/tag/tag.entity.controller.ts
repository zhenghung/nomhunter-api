import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  Post,
} from "@nestjs/common";
import { TagEntityService } from "./tag.entity.service";
import { TagEntity } from "./tag.entity";
import { CreateTagReq } from "./dto/create-tag.req";
import { HttpExceptionsUtil } from "../../common/util/http-exceptions.util";

@ApiTags("TagEntity")
@Controller("entities/tag")
export class TagEntityController {
  private readonly logger = new Logger(TagEntityController.name);

  constructor(private readonly tagEntityService: TagEntityService) {}

  @Post()
  create(@Body() createTagReq: CreateTagReq): Promise<TagEntity> {
    this.logger.log(`Creating tag with name: ${createTagReq.name}`);
    return this.tagEntityService.create(createTagReq).catch((error) => {
      throw HttpExceptionsUtil.createHttpException(
        error.message,
        HttpStatus.CONFLICT,
        this.logger,
        error
      );
    });
  }

  @ApiOperation({ summary: "Fetch all Tags" })
  @ApiOkResponse({ description: "Tags retrieved successfully" })
  @Get()
  findAll(): Promise<TagEntity[]> {
    return this.tagEntityService.findAll();
  }

  @ApiOperation({ summary: "Fetch Tag by id" })
  @ApiOkResponse({ description: "Tag retrieved successfully" })
  @Get(":id")
  findOne(@Param("id") id: string): Promise<TagEntity> {
    return this.tagEntityService.getById(id);
  }
}
