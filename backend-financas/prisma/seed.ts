import { PrismaClient, TransactionType } from "@prisma/client";
import * as bcrypt from "bcryptjs";
const prisma = new PrismaClient();
async function main() {
  const passwordHash = await bcrypt.hash("senha1234", 12);
  const user = await prisma.user.upsert({
    where: { email: "demo@financas.local" },
    update: { name: "Usuário Demo", passwordHash },
    create: {
      name: "Usuário Demo",
      email: "demo@financas.local",
      passwordHash,
    },
  });
  const categoryData: Array<[string, TransactionType]> = [
    ["Salário", TransactionType.INCOME],
    ["Alimentação", TransactionType.EXPENSE],
    ["Moradia", TransactionType.EXPENSE],
    ["Transporte", TransactionType.EXPENSE],
  ];
  const categories = new Map<string, string>();
  for (const [name, type] of categoryData) {
    const category = await prisma.category.upsert({
      where: { userId_name_type: { userId: user.id, name, type } },
      update: {},
      create: { userId: user.id, name, type },
    });
    categories.set(name, category.id);
  }
  const transactions = [
    {
      id: "00000000-0000-4000-8000-000000000001",
      type: TransactionType.INCOME,
      amountCents: 500000,
      description: "Salário de outubro",
      date: new Date("2026-10-05T12:00:00.000Z"),
      categoryId: categories.get("Salário")!,
    },
    {
      id: "00000000-0000-4000-8000-000000000002",
      type: TransactionType.EXPENSE,
      amountCents: 85000,
      description: "Aluguel",
      date: new Date("2026-10-06T12:00:00.000Z"),
      categoryId: categories.get("Moradia")!,
    },
    {
      id: "00000000-0000-4000-8000-000000000003",
      type: TransactionType.EXPENSE,
      amountCents: 32000,
      description: "Mercado do mês",
      date: new Date("2026-10-10T12:00:00.000Z"),
      categoryId: categories.get("Alimentação")!,
    },
    {
      id: "00000000-0000-4000-8000-000000000004",
      type: TransactionType.EXPENSE,
      amountCents: 12000,
      description: "Transporte",
      date: new Date("2026-10-12T12:00:00.000Z"),
      categoryId: categories.get("Transporte")!,
    },
    {
      id: "00000000-0000-4000-8000-000000000005",
      type: TransactionType.EXPENSE,
      amountCents: 5000,
      description: "Despesa sem categoria",
      date: new Date("2026-10-15T12:00:00.000Z"),
      categoryId: null,
    },
  ];
  for (const transaction of transactions)
    await prisma.transaction.upsert({
      where: { id: transaction.id },
      update: transaction,
      create: { ...transaction, userId: user.id },
    });
  console.log(`Seed concluído: ${user.email}`);
  console.log("Senha do usuário demo: senha1234");
}
main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
