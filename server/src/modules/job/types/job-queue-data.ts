import type { JobSchedule } from '@prisma/client';

export type JobQueueData = Pick<JobSchedule, 'id' | 'jobName' | 'param' | 'timeout'>;
