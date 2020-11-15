import { HttpException, HttpStatus } from '@nestjs/common';

export class HttpExceptions {
    public static incorrectCredentials: HttpException = new HttpException('Wrong credentials provided', HttpStatus.UNAUTHORIZED);
}
