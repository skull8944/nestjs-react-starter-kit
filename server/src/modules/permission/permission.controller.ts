import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

import { PaginationRequest, PaginationResponse } from '../../utils/pagination';
import { ReqUser } from '../auth/dtos/req-user';
import { User } from '../auth/user.decorator';

import {
  PermissionAddPersonDto,
  PermissionAddRoleDto,
  PermissionAntdNodeDto,
  PermissionEditRoleDto,
  PermissionPersonTableDto,
  PermissionPersonTableQueryDto,
  PermissionRoleMenuDto,
  PermissionRoleTableDto,
  PermissionRoleTableQueryDto,
} from './dtos';
import { PermissionService } from './permission.service';

@Controller('/v1/permission')
export class PermissionController {
  constructor(private readonly service: PermissionService) {}

  @Get('/auth-menu')
  public getAuthMenu(@User() user: ReqUser): Promise<PermissionAntdNodeDto[]> {
    return this.service.getAuthMenu(user);
  }

  @Get('/role/menu')
  public getRoleMenu(@Query('roleId') roleId?: string): Promise<PermissionRoleMenuDto> {
    return this.service.getRoleMenu(roleId);
  }

  @Post('/person/search')
  public searchPerson(
    @Body() req: PaginationRequest<PermissionPersonTableQueryDto>,
  ): Promise<PaginationResponse<PermissionPersonTableDto>> {
    return this.service.searchPerson(req);
  }

  @Post('/person')
  public addPerson(@Body() body: PermissionAddPersonDto, @User() user: ReqUser): Promise<void> {
    return this.service.addPerson(body, user);
  }

  @Put('/person')
  public editPerson(@Body() body: PermissionAddPersonDto, @User() user: ReqUser): Promise<void> {
    return this.service.editPerson(body, user);
  }

  @Post('/role/search')
  public searchRole(
    @Body() req: PaginationRequest<PermissionRoleTableQueryDto>,
  ): Promise<PaginationResponse<PermissionRoleTableDto>> {
    return this.service.searchRole(req);
  }

  @Post('/role')
  public addRole(@Body() body: PermissionAddRoleDto, @User() user: ReqUser): Promise<void> {
    return this.service.addRole(body, user);
  }

  @Put('/role')
  public editRole(@Body() body: PermissionEditRoleDto, @User() user: ReqUser): Promise<void> {
    return this.service.editRole(body, user);
  }

  @Delete('/role/:id')
  public deleteRole(@Param('id') id: string): Promise<void> {
    return this.service.deleteRole(id);
  }
}
