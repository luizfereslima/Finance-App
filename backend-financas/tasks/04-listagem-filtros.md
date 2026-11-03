# Tasks: Feature 04 (Listagem, filtros e busca)

Spec: specs/04-listagem-filtros.md
Depende de: features 02 e 03

- [x] 4.1 Criar `ListTransactionsQueryDto` com todos os params e valores padrão
- [x] 4.2 Validar `from <= to`, `page >= 1` e `limit` entre 1 e 100
- [x] 4.3 Montar o `where` do Prisma combinando filtros com E, sempre com `userId`
- [x] 4.4 Implementar a busca por `description` com `contains` e `mode: 'insensitive'`
- [x] 4.5 Implementar ordenação (`sort`/`order`) com desempate por `createdAt`
- [x] 4.6 Implementar paginação (`skip`/`take`) e o cálculo de `meta` (total e totalPages)
- [x] 4.7 Implementar `GET /transactions` retornando `{ data, meta }`
- [x] 4.8 Adicionar índices (`userId, date`) e (`userId, categoryId`) e criar a migration
- [x] 4.9 Documentar os query params no Swagger
- [x] 4.10 Escrever testes unitários da montagem do `where`
- [ ] 4.11 Escrever testes e2e: cada filtro, filtros combinados, busca, paginação, ordenação, isolamento
- [ ] 4.12 Testar manualmente cada critério de aceite do spec

## Definição de pronto
Todos os critérios de aceite do spec 04 marcados.
