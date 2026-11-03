import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from './auth/decorators';
import { PrismaService } from './prisma/prisma.service';
@ApiTags('Sistema') @Controller('health')
export class HealthController { constructor(private db: PrismaService) {} @Public() @Get() @ApiOperation({ summary: 'Verificar API e banco de dados' }) @ApiResponse({ status: 200, description: 'API e banco disponíveis' }) @ApiResponse({ status: 503, description: 'Banco indisponível' }) async check() { try { await this.db.$queryRaw`SELECT 1`; return { status: 'ok', database: 'ok' }; } catch { throw new ServiceUnavailableException({ status: 'error', database: 'down' }); } } }
