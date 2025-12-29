import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Logger,
  BadRequestException,
} from '@nestjs/common';

@Catch()
export class SequelizeExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('DBException');

  catch(exception: any, host: ArgumentsHost) {
    if (exception?.original?.code === 'ER_NO_REFERENCED_ROW_2') {
      this.logger.error(
        'FK constraint error',
        JSON.stringify({
          sqlMessage: exception.original.sqlMessage,
          parameters: exception.parameters,
        }),
      );

      throw new BadRequestException(
        'Invalid reference: related record does not exist',
      );
    }

    throw exception;
  }
}
