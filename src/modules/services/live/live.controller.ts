import { Controller, Get, Logger } from "@nestjs/common";
import { LiveService } from "./live.service";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ZoneInterface } from "./interface/zone.interface";

@ApiTags("Live")
@Controller("live")
export class LiveController {
  private readonly logger = new Logger(LiveController.name);

  constructor(private readonly liveService: LiveService) {}

  // TODO: Add JWT and Auth Bear Swagger when user specific details are added (visited / ranked)
  @ApiOperation({ summary: "Fetch live venue summary details" })
  @ApiOkResponse({ description: "Live venue retrieved successfully" })
  @Get()
  async getLiveZonesAndVenues(): Promise<ZoneInterface[]> {
    this.logger.log("Fetching live zone and venue details");
    return this.liveService.getLiveZonesAndVenues();
  }
}
