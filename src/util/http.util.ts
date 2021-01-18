import { HttpException, HttpStatus, Logger } from "@nestjs/common";
import { EntityNotFoundError } from "typeorm/error/EntityNotFoundError";

export class HttpUtil {
  public static genericFindByUUIDErrorHandler(
    entity: string,
    id: string,
    logger: Logger
  ) {
    return (error: Error) => {
      if (error instanceof EntityNotFoundError) {
        throw HttpUtil.createHttpException(
          `${entity} of id: ${id} does not exist`,
          HttpStatus.NOT_FOUND,
          logger,
          error
        );
      } else {
        throw HttpUtil.createHttpException(
          `${id} is not a UUID`,
          HttpStatus.BAD_REQUEST,
          logger,
          error
        );
      }
    };
  }

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
