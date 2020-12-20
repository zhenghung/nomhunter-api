import { HttpException, HttpStatus, Logger } from "@nestjs/common";

export class HttpUtil {
  public static createHttpException(
    errorMsg: string,
    httpStatus: HttpStatus,
    logger: Logger,
    error?: Error
  ): HttpException {
    if (error) {
      logger.log(error.message);
    }
    logger.log(errorMsg);
    throw new HttpException(errorMsg, httpStatus);
  }
}
