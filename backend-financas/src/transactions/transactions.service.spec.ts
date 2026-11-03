import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '../prisma/prisma.service';
import { CategoriesService } from '../categories/categories.service';
import { TransactionType } from '@prisma/client';

describe('TransactionsService', () => {
  const db = { transaction: { create: jest.fn(), findFirst: jest.fn(), update: jest.fn(), delete: jest.fn(), findMany: jest.fn(), count: jest.fn() } } as unknown as PrismaService;
  const categories = { validate: jest.fn() } as unknown as CategoriesService;
  let service: TransactionsService;
  beforeEach(() => { jest.clearAllMocks(); service = new TransactionsService(db, categories); });
  it('sempre cria usando o usuário informado pelo token', async () => { (db.transaction.create as jest.Mock).mockResolvedValue({ id: 't1' }); await service.create('u1', { type: TransactionType.INCOME, amountCents: 100, description: 'Salário', date: '2026-10-01T00:00:00.000Z' }); expect(db.transaction.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ userId: 'u1' }) })); });
  it('retorna 404 quando a transação não pertence ao usuário', async () => { (db.transaction.findFirst as jest.Mock).mockResolvedValue(null); await expect(service.findOne('u1', 't1')).rejects.toBeInstanceOf(NotFoundException); });
  it('rejeita período invertido', async () => { await expect(service.list('u1', { page: 1, limit: 20, sort: 'date', order: 'desc', from: '2026-10-31', to: '2026-10-01' })).rejects.toBeInstanceOf(BadRequestException); });
  it('monta filtros combinados e calcula paginação', async () => { (db.transaction.findMany as jest.Mock).mockResolvedValue([]); (db.transaction.count as jest.Mock).mockResolvedValue(41); const result = await service.list('u1', { page: 2, limit: 20, sort: 'date', order: 'desc', type: TransactionType.EXPENSE, search: 'mercado' }); expect(result.meta).toEqual({ page: 2, limit: 20, total: 41, totalPages: 3 }); expect(db.transaction.findMany).toHaveBeenCalledWith(expect.objectContaining({ skip: 20, take: 20, where: expect.objectContaining({ userId: 'u1', type: TransactionType.EXPENSE, description: { contains: 'mercado', mode: 'insensitive' } }) })); });
  it('retorna o id e o nome da categoria na listagem', async () => { (db.transaction.findMany as jest.Mock).mockResolvedValue([{ id: 't1', categoryId: 'c1', category: { name: 'Mercado' } }]); (db.transaction.count as jest.Mock).mockResolvedValue(1); const result = await service.list('u1', { page: 1, limit: 20, sort: 'date', order: 'desc' }); expect(result.data).toEqual([{ id: 't1', categoryId: 'c1', categoryName: 'Mercado' }]); });
});
