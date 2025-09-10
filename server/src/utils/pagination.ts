import { ApiProperty } from '@nestjs/swagger';

import { IsArray, IsIn, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class Pagination {
  constructor(init?: Pagination) {
    if (init) {
      Object.assign(this, init);
    }
  }

  @Min(1)
  @IsNumber()
  // ! starts from 1
  current: number = 1;

  @IsNumber()
  pageSize: number = 10;

  @IsNumber()
  total: number = 0;
}

export class Sorter<TField extends string = string> {
  constructor(init: Sorter<TField>) {
    Object.assign(this, init);
  }

  @IsString()
  field!: TField;

  @IsIn(['ascend', 'descend'])
  order!: 'ascend' | 'descend';
}

export class PaginationRequest<TQuery = undefined, TField extends string = string> {
  constructor(init: PaginationRequest<TQuery>) {
    Object.assign(this, init);
  }

  @ApiProperty()
  @IsOptional()
  pagination: Pagination = new Pagination();

  @ApiProperty()
  @IsOptional()
  query?: TQuery;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  sorters: Sorter<TField>[] = [];
}

export class PaginationResponse<TData, TField extends string = string> {
  constructor(init: PaginationResponse<TData>) {
    Object.assign(this, init);
  }

  @ApiProperty()
  pagination!: Pagination;

  @ApiProperty()
  sorters: Sorter<TField>[] = [];

  data!: TData[];
}
