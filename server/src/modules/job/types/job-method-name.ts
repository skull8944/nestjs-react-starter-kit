import { JobService } from '../job.service';

export type JobMethodName = keyof Omit<JobService, 'callJob'>;
