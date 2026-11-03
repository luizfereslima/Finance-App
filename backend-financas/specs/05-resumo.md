# Feature 05: Resumo financeiro

## Objetivo
Dar ao usuário uma visão consolidada: total de entradas, total de despesas, saldo e gastos por categoria.

## Endpoints (todos exigem token)
### `GET /summary`
Query: `from` e `to` (ISO date, opcionais). Sem eles, usa o mês corrente.

Resposta 200:
```json
{
  "period": { "from": "2026-10-01", "to": "2026-10-31" },
  "totalIncomeCents": 500000,
  "totalExpenseCents": 320000,
  "balanceCents": 180000,
  "transactionsCount": 42
}
```

### `GET /summary/by-category`
Query: `from`, `to` e `type` (padrão `EXPENSE`).

Resposta 200:
```json
{
  "period": { "from": "...", "to": "..." },
  "type": "EXPENSE",
  "items": [
    { "categoryId": "uuid", "name": "Alimentação", "totalCents": 120000, "percentage": 37.5 },
    { "categoryId": null, "name": "Sem categoria", "totalCents": 8000, "percentage": 2.5 }
  ]
}
```

## Regras
- `balanceCents = totalIncomeCents - totalExpenseCents` (pode ser negativo).
- Cálculo feito no banco (agregação), não carregando todas as transações em memória.
- Considera apenas dados do usuário logado e apenas o período informado.
- `percentage` com 1 casa decimal; itens ordenados do maior para o menor total.
- Período sem transações retorna zeros e lista vazia (não é erro).
- `from` maior que `to` retorna 400.

## Critérios de aceite
- [ ] Totais e saldo batem com a soma manual das transações de teste.
- [ ] Transações sem categoria aparecem como "Sem categoria".
- [ ] Período vazio retorna zeros e `items: []`.
- [ ] Dados de outros usuários não entram nos cálculos.
- [ ] Saldo negativo é calculado corretamente.
- [ ] Testes e2e cobrem os cenários acima.

## Fora de escopo
- Gráficos, comparação entre meses, metas e orçamentos.
