import { PermissionAntdNodeDto } from './permission-antd-node.dto';

export class PermissionRoleMenuDto {
  constructor(init: PermissionRoleMenuDto) {
    Object.assign(this, init);
  }

  all!: PermissionAntdNodeDto[];

  checked!: string[];
}
