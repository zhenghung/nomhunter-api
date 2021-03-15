import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Logger,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { RequestWithPlayer } from "./interface/request-with-player.interface";
import { LocalAuthGuard } from "./guard/local-auth.guard";
import JwtAuthGuard from "./guard/jwt-auth.guard";
import { LoginDto } from "./dto/login.dto";
import { PlayerEntity } from "../../entities/player/player.entity";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { TokenResponseInterface } from "./interface/token-response.interface";

@ApiTags("Authentication")
@Controller("auth")
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: "Create a new Player account" })
  @ApiCreatedResponse({ description: "Player has been successfully created" })
  @ApiBadRequestResponse({ description: "Email already exists" })
  @ApiInternalServerErrorResponse({ description: "Something went wrong" })
  @Post("register")
  async register(@Body() registrationData: RegisterDto): Promise<PlayerEntity> {
    return this.authService.register(registrationData).then((player) => {
      this.logger.log(
        `Player with email: ${player.email} successfully created`
      );
      return player;
    });
  }

  @Post("login")
  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    summary: "Retrieve signed bearer token using player credentials",
  })
  @ApiOkResponse({ description: "Successfully logged in" })
  @ApiUnauthorizedResponse({ description: "Incorrect credentials" })
  login(
    @Request() request: RequestWithPlayer,
    @Body() loginData: LoginDto
  ): TokenResponseInterface {
    this.logger.log(`Player ${loginData.email} successfully logged in`);
    return this.authService.login(request.user);
  }

  @Get("profile")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Fetch Player Profile, using signed bearer auth token",
  })
  @ApiOkResponse({ description: "Player Profile retrieved" })
  @ApiUnauthorizedResponse({ description: "Unauthorized bearer token" })
  getProfile(@Request() request: RequestWithPlayer): PlayerEntity {
    this.logger.log(`Player ${request.user.email} authenticated`);
    return request.user;
  }
}
