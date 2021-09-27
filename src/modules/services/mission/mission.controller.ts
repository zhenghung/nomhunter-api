import { Controller, Get, Param, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { MissionService } from "./mission.service";
import JwtAuthGuard from "../auth/guard/jwt-auth.guard";
import { RequestWithPlayer } from "../auth/interface/request-with-player.interface";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { MissionGroupsInterface } from "./interface/mission-groups.interface";
import { MissionTransformer } from "./mission.transformer";
import { ApiImplicitQuery } from "@nestjs/swagger/dist/decorators/api-implicit-query.decorator";
import { OptionalBoolPipe } from "../../common/pipes/optional-bool.pipe";

@ApiTags("Mission")
@Controller("mission")
export class MissionController {
  constructor(private readonly eventEmitter: EventEmitter2, private readonly missionService: MissionService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: "Fetch missions for player" })
  @ApiCreatedResponse({
    description: "Mission created successfully for player",
  })
  @Get()
  @UseGuards(JwtAuthGuard)
  async fetchMissions(@Req() requestWithPlayer: RequestWithPlayer): Promise<MissionGroupsInterface> {
    return this.missionService
      .fetchAllMissionsForPlayer(requestWithPlayer.user.id)
      .then((missionGroupEntities) => MissionTransformer.map(missionGroupEntities));
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Claim Reward" })
  @ApiCreatedResponse({
    description: "Claim Reward for Completed Mission",
  })
  @Get("/:missionId/claim")
  @UseGuards(JwtAuthGuard)
  async claimReward(@Req() requestWithPlayer: RequestWithPlayer, @Param("missionId") missionId: string): Promise<void> {
    return this.missionService.claimReward(requestWithPlayer.user.id, missionId);
  }

  @ApiImplicitQuery({
    name: "missionGroupId",
    required: true,
    type: String,
  })
  @ApiImplicitQuery({
    name: "remove",
    required: false,
    type: Boolean,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: "Toggle flag status for mission group" })
  @ApiCreatedResponse({
    description: "Flag/Unflag mission group for player",
  })
  @Get("flag")
  @UseGuards(JwtAuthGuard)
  async flagMissionGroup(
    @Req() requestWithPlayer: RequestWithPlayer,
    @Query("missionGroupId") missionGroupId: string,
    @Query("remove", OptionalBoolPipe) remove?: boolean
  ): Promise<void> {
    return this.missionService.setFlag(requestWithPlayer.user.id, missionGroupId, !remove);
  }
}
