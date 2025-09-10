import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginRequestDto, LoginResponseDto } from './dtos';

@Controller('/v1/auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('/login')
  public login(@Body() body: LoginRequestDto): Promise<LoginResponseDto> {
    return this.service.login(body);
  }
}
