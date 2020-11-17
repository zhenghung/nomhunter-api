import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../entities/users/users.service';
import { User } from '../entities/users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { HttpExceptions } from './http.exception';
import { TokenResponseInterface } from './interface/token-response.interface';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    /**
     * Encrypts password by adding a salt and hashing it, then creating a new User entity
     * @param registrationData
     */
    public async register(registrationData: RegisterDto): Promise<User> {
        const hashedPassword = await bcrypt.hash(registrationData.password, 10);
        try {
            return await this.usersService.create({
                ...registrationData,
                password: hashedPassword,
            });
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (error?.code === '23505') {
                throw new HttpException('User with that email already exists', HttpStatus.BAD_REQUEST);
            }
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * JWT service signs the user's email and id as bearer token
     * @param user User entity from the database
     */
    public login(user: User): TokenResponseInterface {
        const payload = { email: user.email, sub: user.id };
        return {
            bearerToken: this.jwtService.sign(payload),
        };
    }

    /**
     * For LocalStrategy Authentication, Validates User Credentials
     * @param email Entered Email
     * @param plainTextPassword Entered Plain-text Password
     */
    public async validateUser(email: string, plainTextPassword: string): Promise<User> {
        try {
            const user = await this.usersService.getByEmail(email);
            const correctPassword = await AuthService.verifyPassword(plainTextPassword, user.password);
            if (user && correctPassword) {
                return user;
            }
        } catch (e) {
            throw HttpExceptions.incorrectCredentials;
        }
        throw HttpExceptions.incorrectCredentials;
    }

    private static async verifyPassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainTextPassword, hashedPassword);
    }

}
