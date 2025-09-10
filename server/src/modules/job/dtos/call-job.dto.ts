import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsOptional } from 'class-validator';

import type { JobMethodName } from '../types';

type CallJobParam = Array<unknown> | Record<string, unknown> | null;

export class CallJobDto<TParam extends CallJobParam = CallJobParam> {
  constructor(data: CallJobDto) {
    Object.assign(this, data);
  }

  @ApiProperty({ type: String })
  @IsNotEmpty()
  methodName!: JobMethodName;

  @ApiProperty({ type: [Object], required: false, example: ['param1', 'param2'] })
  @IsOptional()
  param?: TParam;
}
