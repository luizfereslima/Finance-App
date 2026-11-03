import { SummaryController } from './summary.controller';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionType } from '@prisma/client';

describe('SummaryController', () => {
  const db = {
    transaction: { groupBy: jest.fn() },
    category: { findMany: jest.fn() },
  } as unknown as PrismaService;
  let controller: SummaryController;
  beforeEach(() => {
    jest.clearAllMocks();
    controller = new SummaryController(db);
  });
  it('calcula saldo negativo e contagem', async () => {
    (db.transaction.groupBy as jest.Mock).mockResolvedValue([
      { type: TransactionType.INCOME, _sum: { amountCents: 100 }, _count: 1 },
      { type: TransactionType.EXPENSE, _sum: { amountCents: 250 }, _count: 2 },
    ]);
    const result = await controller.summary(
      { userId: 'u1' },
      { type: TransactionType.EXPENSE },
    );
    expect(result.balanceCents).toBe(-150);
    expect(result.transactionsCount).toBe(3);
  });
  it('retorna categorias sem transações como lista vazia', async () => {
    (db.transaction.groupBy as jest.Mock).mockResolvedValue([]);
    (db.category.findMany as jest.Mock).mockResolvedValue([]);
    const result = await controller.byCategory(
      { userId: 'u1' },
      { type: TransactionType.EXPENSE },
    );
    expect(result.items).toEqual([]);
  });
  it('calcula percentual e ordena por total', async () => {
    (db.transaction.groupBy as jest.Mock).mockResolvedValue([
      { categoryId: 'c1', _sum: { amountCents: 25 } },
      { categoryId: null, _sum: { amountCents: 75 } },
    ]);
    (db.category.findMany as jest.Mock).mockResolvedValue([
      { id: 'c1', name: 'Mercado' },
    ]);
    const result = await controller.byCategory(
      { userId: 'u1' },
      { type: TransactionType.EXPENSE },
    );
    expect(result.items).toEqual([
      {
        categoryId: null,
        name: 'Sem categoria',
        totalCents: 75,
        percentage: 75,
      },
      { categoryId: 'c1', name: 'Mercado', totalCents: 25, percentage: 25 },
    ]);
  });
});
