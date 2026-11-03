import { ConflictException, NotFoundException } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionType } from '@prisma/client';

describe('CategoriesService', () => {
  const db = {
    category: {
      findMany: jest.fn(),
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    transaction: { count: jest.fn() },
  } as unknown as PrismaService;
  let service: CategoriesService;
  beforeEach(() => {
    jest.clearAllMocks();
    service = new CategoriesService(db);
  });
  it('lista somente categorias do usuário e tipo informado', async () => {
    (db.category.findMany as jest.Mock).mockResolvedValue([]);
    await service.list('u1', TransactionType.EXPENSE);
    expect(db.category.findMany).toHaveBeenCalledWith({
      where: { userId: 'u1', type: TransactionType.EXPENSE },
      orderBy: { name: 'asc' },
    });
  });
  it('converte categoria duplicada em 409', async () => {
    (db.category.create as jest.Mock).mockRejectedValue({ code: 'P2002' });
    await expect(
      service.create('u1', { name: 'Mercado', type: TransactionType.EXPENSE }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
  it('impede remover categoria em uso', async () => {
    (db.category.findFirst as jest.Mock).mockResolvedValue({ id: 'c1' });
    (db.transaction.count as jest.Mock).mockResolvedValue(1);
    await expect(service.remove('u1', 'c1')).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(db.category.delete).not.toHaveBeenCalled();
  });
  it('retorna 404 para categoria de outro usuário', async () => {
    (db.category.findFirst as jest.Mock).mockResolvedValue(null);
    await expect(
      service.update('u1', 'c1', { name: 'Nova' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
