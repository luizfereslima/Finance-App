# Backend de Finanças (NestJS)

API REST que registra entradas (receitas) e despesas de cada usuário.

- Framework: NestJS + TypeScript
- Banco: PostgreSQL com Prisma (ORM)
- Autenticação: JWT (access token)
- Validação: class-validator + class-transformer
- Documentação da API: Swagger (`/docs`)
- Testes: Jest (unitários) + Supertest (e2e)

## Seeder

Com o PostgreSQL disponível e as migrations aplicadas, instale as dependências e execute:

```bash
npm install
npm run prisma:seed
```

O seeder é idempotente e cria o usuário `demo@financas.local`, com a senha `senha1234`, categorias e transações de exemplo.

## Regras globais (valem para todas as features)
- Valores monetários são guardados em **centavos** (inteiro). Nunca usar float.
- Datas trafegam em ISO 8601 (UTC).
- Todo dado financeiro pertence a um usuário. Um usuário **nunca** acessa dados de outro (retornar 404, não 403, para não revelar existência).
- Erros seguem o formato padrão do Nest: `{ statusCode, message, error }`.
- Senhas nunca são retornadas em nenhuma resposta nem aparecem em logs.

## Ordem de implementação
| # | Feature | Spec | Tasks |
|---|---------|------|-------|
| 0 | Setup do projeto e banco | specs/00-setup-projeto.md | tasks/00-setup-projeto.md |
| 1 | Cadastro e autenticação | specs/01-autenticacao.md | tasks/01-autenticacao.md |
| 2 | Registro de transações | specs/02-transacoes.md | tasks/02-transacoes.md |
| 3 | Categorias | specs/03-categorias.md | tasks/03-categorias.md |
| 4 | Listagem, filtros e busca | specs/04-listagem-filtros.md | tasks/04-listagem-filtros.md |
| 5 | Resumo financeiro | specs/05-resumo.md | tasks/05-resumo.md |
