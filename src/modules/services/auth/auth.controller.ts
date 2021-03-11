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
import { RequestWithUser } from "./interface/request-with-user.interface";
import { LocalAuthGuard } from "./guard/local-auth.guard";
import JwtAuthGuard from "./guard/jwt-auth.guard";
import { LoginDto } from "./dto/login.dto";
import { UserEntity } from "../../entities/user/user.entity";
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

  @ApiOperation({ summary: "Create a new User account" })
  @ApiCreatedResponse({ description: "User has been successfully created" })
  @ApiBadRequestResponse({ description: "Email already exists" })
  @ApiInternalServerErrorResponse({ description: "Something went wrong" })
  @Post("register")
  async register(@Body() registrationData: RegisterDto): Promise<UserEntity> {
    return this.authService.register(registrationData).then((user) => {
      this.logger.log(`User with email: ${user.email} successfully created`);
      return user;
    });
  }

  @Post("login")
  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    summary: "Retrieve signed bearer token using user credentials",
  })
  @ApiOkResponse({ description: "Successfully logged in" })
  @ApiUnauthorizedResponse({ description: "Incorrect credentials" })
  login(
    @Request() request: RequestWithUser,
    @Body() loginData: LoginDto
  ): TokenResponseInterface {
    this.logger.log(`User ${loginData.email} successfully logged in`);
    return this.authService.login(request.user);
  }

  @Get("profile")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Fetch User Profile, using signed bearer auth token",
  })
  @ApiOkResponse({ description: "User Profile retrieved" })
  @ApiUnauthorizedResponse({ description: "Unauthorized bearer token" })
  getProfile(@Request() request: RequestWithUser): UserEntity {
    this.logger.log(`User ${request.user.email} authenticated`);
    return request.user;
  }
}
