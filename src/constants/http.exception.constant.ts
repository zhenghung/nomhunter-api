import { HttpException, HttpStatus } from "@nestjs/common";

export class HttpExceptions {
  public static readonly INCORRECT_CREDENTIALS: HttpException = new HttpException(
    "Wrong credentials provided",
    HttpStatus.UNAUTHORIZED
  );
}
