import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Category, TransactionType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos';
@Injectable()
export class CategoriesService {
  constructor(private db: PrismaService) {}
  list(userId: string, type?: TransactionType) {
    return this.db.category.findMany({
      where: { userId, ...(type ? { type } : {}) },
      orderBy: { name: 'asc' },
    });
  }
  async create(userId: string, dto: CreateCategoryDto) {
    try {
      return await this.db.category.create({ data: { ...dto, userId } });
    } catch (e: any) {
      if (e.code === 'P2002')
        throw new ConflictException('Categoria já cadastrada');
      throw e;
    }
  }
  async update(userId: string, id: string, dto: UpdateCategoryDto) {
    const category = await this.db.category.findFirst({
      where: { id, userId },
    });
    if (!category) throw new NotFoundException();
    try {
      return await this.db.category.update({ where: { id }, data: dto });
    } catch (e: any) {
      if (e.code === 'P2002')
        throw new ConflictException('Categoria já cadastrada');
      throw e;
    }
  }
  async remove(userId: string, id: string) {
    const category = await this.db.category.findFirst({
      where: { id, userId },
    });
    if (!category) throw new NotFoundException();
    if (await this.db.transaction.count({ where: { categoryId: id } }))
      throw new ConflictException('Categoria possui transações vinculadas');
    await this.db.category.delete({ where: { id } });
  }
  async validate(
    userId: string,
    id: string,
    type: TransactionType,
  ): Promise<Category> {
    const c = await this.db.category.findFirst({ where: { id, userId } });
    if (!c || c.type !== type)
      throw new BadRequestException('Categoria inválida para esta transação');
    return c;
  }
}
