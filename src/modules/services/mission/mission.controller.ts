import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { MissionService } from "./mission.service";
import JwtAuthGuard from "../auth/guard/jwt-auth.guard";
import { RequestWithPlayer } from "../auth/interface/request-with-player.interface";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { PlayerMissionEntity } from "../../entities/playerMission/player-mission.entity";

@ApiTags("Mission")
@Controller("mission")
export class MissionController {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly missionService: MissionService
  ) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: "Fetch missions for player" })
  @ApiCreatedResponse({
    description: "Mission created successfully for player",
  })
  @Get()
  @UseGuards(JwtAuthGuard)
  async fetchMissions(
    @Req() requestWithPlayer: RequestWithPlayer
  ): Promise<PlayerMissionEntity[]> {
    return this.missionService.findPlayerMission(requestWithPlayer.user.id);
  }
}
