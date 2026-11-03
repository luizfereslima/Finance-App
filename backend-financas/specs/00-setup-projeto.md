# Feature 00: Setup do projeto e banco

## Objetivo
Ter o projeto NestJS rodando, conectado ao PostgreSQL, com validação, configuração e documentação básicas.

## Comportamento esperado
- Projeto Nest criado com TypeScript e estrutura modular (um módulo por feature).
- PostgreSQL sobe localmente via Docker Compose.
- Prisma configurado, com migrations versionadas.
- Variáveis de ambiente validadas na inicialização (app não sobe se faltar alguma).
- `ValidationPipe` global com `whitelist` e `forbidNonWhitelisted` ativados.
- Endpoint `GET /health` informa se a API e o banco estão no ar.
- Swagger disponível em `/docs`.

## Variáveis de ambiente
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN` (ex.: `1h`)
- `PORT` (padrão 3000)

## Critérios de aceite
- [ ] `docker compose up -d` sobe o banco sem erro.
- [ ] `npm run start:dev` inicia a API conectada ao banco.
- [ ] Faltando `DATABASE_URL` ou `JWT_SECRET`, o app falha com mensagem clara.
- [ ] `GET /health` retorna 200 com banco ok e 503 com banco fora do ar.
- [ ] `/docs` abre a documentação Swagger.
- [ ] `.env` está no `.gitignore` e existe um `.env.example`.

## Fora de escopo
- Deploy, CI/CD e Docker da própria API.
