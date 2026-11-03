# Documentação da API no Insomnia

Importe `insomnia-export.json` no Insomnia em **Import/Export > Import Data > From File**.

## Uso

1. Inicie a API com `pnpm run start:dev`.
2. Selecione o ambiente `Local`.
3. Execute `Auth / Login`; o Insomnia salvará o cookie `access_token` automaticamente.
4. Execute as demais requisições autenticadas.

O ambiente `Local` usa `http://localhost:3000` e possui as variáveis `base_url`, `token`, `category_id` e `transaction_id`.

O workspace contém todas as 15 rotas da API: health check, autenticação, usuário atual, categorias, transações e resumo financeiro.
