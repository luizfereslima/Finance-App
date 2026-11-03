# Tasks: Feature 02 (Registro de transações)

Spec: specs/02-transacoes.md
Depende de: feature 01

- [x] 2.1 Criar o enum `TransactionType` e o model `Transaction` no `schema.prisma`
- [x] 2.2 Criar a migration (FK para `User`, `onDelete: Cascade`)
- [x] 2.3 Criar `TransactionsModule`, `TransactionsController` e `TransactionsService`
- [x] 2.4 Criar `CreateTransactionDto` (tipo enum, `amountCents` inteiro positivo, data ISO, descrição 1 a 120)
- [x] 2.5 Criar `UpdateTransactionDto` (parcial do create)
- [x] 2.6 Implementar `POST /transactions` usando o `userId` do token
- [x] 2.7 Implementar `GET /transactions/:id` filtrando por `userId` (404 se não for do usuário)
- [x] 2.8 Implementar `PATCH /transactions/:id` com a mesma checagem de dono
- [x] 2.9 Implementar `DELETE /transactions/:id` (204)
- [x] 2.10 Validar que `categoryId`, se enviado, existe e pertence ao usuário (400)
- [x] 2.11 Documentar no Swagger
- [x] 2.12 Escrever testes unitários do `TransactionsService`
- [ ] 2.13 Escrever testes e2e: CRUD completo e isolamento entre dois usuários
- [ ] 2.14 Testar manualmente cada critério de aceite do spec

## Definição de pronto
Todos os critérios de aceite do spec 02 marcados.

> A validação de categoria do mesmo tipo (task 3.7) completa a task 2.10.
