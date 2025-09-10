import { IsString } from 'class-validator';

export class LoginRequestDto {
  @IsString()
  accessToken!: string;
}
