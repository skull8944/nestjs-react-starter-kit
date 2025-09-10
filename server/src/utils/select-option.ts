import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class SelectOption<T = string> {
  constructor(init: SelectOption<T>) {
    Object.assign(this, init);
  }

  label!: string;

  value!: T;
}

/**
 * @description for auto-complete
 */
export class SelectOptionsQueryDto {
  constructor(init: SelectOptionsQueryDto) {
    Object.assign(this, init);
  }

  @IsString()
  keyword!: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  limit: number = 15;
}
