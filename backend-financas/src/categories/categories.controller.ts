import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos';
import { TransactionType } from '@prisma/client';
import { CategoriesService } from './categories.service';
@ApiTags('Categorias')
@ApiBearerAuth()
@Controller('categories')
export class CategoriesController {
  constructor(private service: CategoriesService) {}
  @Get()
  @ApiOperation({ summary: 'Listar categorias' })
  @ApiQuery({ name: 'type', required: false, enum: TransactionType })
  list(@CurrentUser() u: any, @Query('type') type?: TransactionType) {
    return this.service.list(u.userId, type);
  }
  @Post() @ApiOperation({ summary: 'Criar categoria' }) create(
    @CurrentUser() u: any,
    @Body() dto: CreateCategoryDto,
  ) {
    return this.service.create(u.userId, dto);
  }
  @Patch(':id') @ApiOperation({ summary: 'Atualizar categoria' }) update(
    @CurrentUser() u: any,
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.service.update(u.userId, id, dto);
  }
  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Excluir categoria' })
  async remove(@CurrentUser() u: any, @Param('id') id: string) {
    await this.service.remove(u.userId, id);
  }
}
