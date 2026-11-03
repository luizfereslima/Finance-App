import { Controller, Get, NotFoundException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators';
import { UsersService } from './users.service';
@ApiTags('Usuários')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}
  @Get('me') @ApiOperation({ summary: 'Obter usuário autenticado' }) async me(
    @CurrentUser() user: { userId: string },
  ) {
    const u = await this.users.findById(user.userId);
    if (!u) throw new NotFoundException();
    return { id: u.id, name: u.name, email: u.email, createdAt: u.createdAt };
  }
}
