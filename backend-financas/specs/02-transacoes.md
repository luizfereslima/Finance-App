# Feature 02: Registro de transações (entradas e despesas)

## Objetivo
Permitir que o usuário registre, consulte, edite e remova suas entradas e despesas.

## Modelo: Transaction
- `id` (uuid)
- `userId` (FK → User)
- `type`: `INCOME` | `EXPENSE`
- `amountCents`: inteiro > 0 (sempre positivo; o sinal vem do `type`)
- `description`: texto, 1 a 120 caracteres
- `date`: data da transação (ISO 8601)
- `categoryId`: opcional (FK → Category, ver feature 03)
- `createdAt`, `updatedAt`

## Endpoints (todos exigem token)
### `POST /transactions`
- Body: `{ type, amountCents, description, date, categoryId? }`
- Sucesso: 201 com a transação criada.

### `GET /transactions/:id`
- Retorna a transação se for do usuário logado; senão 404.

### `PATCH /transactions/:id`
- Atualiza qualquer campo editável (`type`, `amountCents`, `description`, `date`, `categoryId`).
- Transação de outro usuário: 404.

### `DELETE /transactions/:id`
- Sucesso: 204. Transação de outro usuário: 404.

> A listagem (`GET /transactions`) é feita na feature 04.

## Regras
- `userId` vem sempre do token, **nunca** do body.
- `amountCents` deve ser inteiro positivo; decimais ou valores ≤ 0 retornam 400.
- `date` não pode ser inválida; datas futuras são permitidas (lançamentos agendados).
- Se `categoryId` for informado, a categoria deve existir e pertencer ao mesmo usuário; senão 400.

## Critérios de aceite
- [ ] Criar entrada e despesa funciona e persiste no banco.
- [ ] Usuário A não consegue ler, editar nem excluir transação do usuário B (404).
- [ ] Enviar `userId` no body é rejeitado (400) pelo `whitelist`.
- [ ] Valor 0, negativo ou decimal retorna 400.
- [ ] `categoryId` de outro usuário retorna 400.
- [ ] Testes e2e cobrem criação, leitura, edição, remoção e isolamento entre usuários.

## Fora de escopo
- Transações recorrentes, anexos/comprovantes e múltiplas moedas.
