import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl, ip, query, body } = req;
    const start = Date.now();

    res.on('finish', () => {
      const ms = Date.now() - start;
      console.log(
        `[REQUEST] ${method} ${originalUrl} - ${res.statusCode} - ${ms}ms - IP: ${ip}`,
      );

      // Uncomment if you want detailed logs:
      // console.log('Query:', query);
      // console.log('Body:', body);
    });

    next();
  }
}
