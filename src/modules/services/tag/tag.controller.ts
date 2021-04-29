import { Controller, Get, Logger, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { TagService } from "./tag.service";
import { ApiImplicitQuery } from "@nestjs/swagger/dist/decorators/api-implicit-query.decorator";

@ApiTags("Tag")
@Controller("tag")
export class TagController {
  private readonly logger = new Logger(TagController.name);

  constructor(private readonly tagService: TagService) {}

  @ApiImplicitQuery({
    name: "venueId",
    required: false,
    type: String,
  })
  @ApiOperation({ summary: "Fetch all tags" })
  @Get()
  get(@Query("venueId") venueId?: string): Promise<string[]> {
    if (venueId) {
      return this.tagService.findTagsForVenue(venueId);
    }
    return this.tagService.findAllTags();
  }
}
