# Tasks: Feature 05 (Resumo financeiro)

Spec: specs/05-resumo.md
Depende de: features 02 e 03

- [x] 5.1 Criar `SummaryModule` e `SummaryController` com a lógica dos cálculos
- [x] 5.2 Criar `SummaryQueryDto` (`from`, `to`, `type`) com validação e período padrão (mês corrente)
- [x] 5.3 Implementar o cálculo de totais com `groupBy`/`aggregate` por `type` no período
- [x] 5.4 Implementar `GET /summary` com saldo (`income - expense`) e contagem
- [x] 5.5 Implementar a agregação por categoria (`groupBy categoryId`) e buscar os nomes
- [x] 5.6 Tratar transações sem categoria como "Sem categoria"
- [x] 5.7 Calcular `percentage` (1 casa decimal) e ordenar do maior para o menor
- [x] 5.8 Implementar `GET /summary/by-category`
- [x] 5.9 Garantir que período vazio retorna zeros e lista vazia
- [x] 5.10 Documentar no Swagger com exemplos de resposta
- [x] 5.11 Escrever testes unitários dos cálculos (saldo negativo, percentuais, período vazio)
- [ ] 5.12 Testar manualmente cada critério de aceite do spec

## Definição de pronto

Todos os critérios de aceite do spec 05 marcados.
