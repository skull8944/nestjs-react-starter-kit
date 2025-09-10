import { Injectable, InternalServerErrorException, Logger, NestMiddleware } from '@nestjs/common';

import type { Request as ExRequest, Response as ExResponse, NextFunction } from 'express';

@Injectable()
export default class ApiLoggerMiddleware implements NestMiddleware {
  async use(req: ExRequest, _res: ExResponse, next: NextFunction) {
    try {
      Logger.log(`'req url = ${req.baseUrl}`);
      next();
    } catch (err) {
      throw new InternalServerErrorException(err instanceof Error ? err.message : err);
    }
  }
}
