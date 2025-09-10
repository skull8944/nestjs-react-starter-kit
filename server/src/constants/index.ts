import type { ReqUser } from '../modules/auth/dtos/req-user';

export const SYSTEM_USER = {
  emplid: 'system',
  name: 'System',
} as const satisfies Pick<ReqUser, 'emplid' | 'name'>;
