import type { Account, JobLog, Prisma } from '@prisma/client';

import type { Request } from 'express';

import { ReqUser } from '@/modules/auth/dtos/req-user';
import type { JobLogWithMethodSetting } from '@/modules/job/types/job-log-with-method-setting';

declare global {
  namespace Express {
    export interface Request {
      // (authUser)
      user?: ReqUser;
      jobLog?: JobLogWithMethodSetting;
    }
  }
}
