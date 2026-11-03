import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto, RegisterDto } from '../dtos';
import { Public } from './decorators';
import { AuthService } from './auth.service';
@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}
  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Cadastrar usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado' })
  register(@Body() dto: RegisterDto) {
    return this.service.register(dto);
  }
  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Autenticar usuário' })
  @ApiResponse({ status: 200, description: 'Cookie de autenticação criado' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken } = await this.service.login(dto);
    response.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 60 * 60 * 1000,
      path: '/',
    });
    return { message: 'Login realizado com sucesso' };
  }
}
