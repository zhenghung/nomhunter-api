import {
    Body,
    Request,
    Controller,
    HttpCode,
    Post,
    UseGuards,
    Get,
    ClassSerializerInterceptor,
    UseInterceptors,
    Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { RequestWithUser } from './interface/request-with-user.interface';
import { LocalAuthGuard } from './guard/local-auth.guard';
import JwtAuthGuard from './guard/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { User } from '../entities/users/user.entity';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { TokenResponseInterface } from './interface/token-response.interface';

@ApiTags('Authentication')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(
        private readonly authService: AuthService,
    ) {}

    @Post('register')
    async register(@Body() registrationData: RegisterDto): Promise<User> {
        return this.authService.register(registrationData).then((user) => {
            this.logger.log(`User with email: ${user.email} successfully created`);
            return user;
        });
    }

    @HttpCode(200)
    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(@Request() request: RequestWithUser, @Body() loginData: LoginDto): TokenResponseInterface {
        this.logger.log(`User ${loginData.email} successfully logged in`);
        return this.authService.login(request.user);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() request: RequestWithUser): User {
        this.logger.log(`User ${request.user.email} authenticated`);
        return request.user;
    }

}
