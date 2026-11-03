# Feature 04: Listagem, filtros e busca

## Objetivo
Permitir listar as transações do usuário com paginação, filtros e busca por texto.

## Endpoint
### `GET /transactions` (exige token)

Query params (todos opcionais):
| Param | Tipo | Descrição |
|-------|------|-----------|
| `type` | `INCOME` \| `EXPENSE` | filtra por tipo |
| `categoryId` | uuid | filtra por categoria |
| `from` | ISO date | data inicial (inclusiva) |
| `to` | ISO date | data final (inclusiva) |
| `search` | string | busca em `description` (sem diferenciar maiúsculas) |
| `page` | int ≥ 1 | padrão 1 |
| `limit` | int 1 a 100 | padrão 20 |
| `sort` | `date` \| `amountCents` | padrão `date` |
| `order` | `asc` \| `desc` | padrão `desc` |

Resposta 200:
```json
{
  "data": [ { "...transaction" } ],
  "meta": { "page": 1, "limit": 20, "total": 134, "totalPages": 7 }
}
```

## Regras
- Retorna apenas transações do usuário logado.
- Filtros se combinam com **E** (todos precisam bater).
- `from` maior que `to` retorna 400.
- `limit` acima de 100 ou `page` menor que 1 retorna 400.
- Desempate de ordenação por `createdAt` para a paginação ser estável.
- Índices no banco para (`userId`, `date`) e (`userId`, `categoryId`).

## Critérios de aceite
- [ ] Cada filtro funciona isoladamente e combinado com os outros.
- [ ] Busca por "mercado" encontra "Mercado do mês" e "MERCADO".
- [ ] A paginação devolve `meta` correto e não repete nem pula itens.
- [ ] Parâmetros inválidos retornam 400 com mensagem clara.
- [ ] Usuário A nunca vê transações do usuário B, mesmo com filtros.
- [ ] Testes e2e cobrem filtros, busca, paginação e ordenação.

## Fora de escopo
- Busca full-text avançada e exportação CSV.
