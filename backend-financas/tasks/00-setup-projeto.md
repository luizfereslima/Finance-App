# Tasks: Feature 00 (Setup do projeto e banco)

Spec: specs/00-setup-projeto.md

- [x] 0.1 Criar o projeto com `nest new` (TypeScript, npm ou pnpm)
- [x] 0.2 Criar `docker-compose.yml` com PostgreSQL e volume persistente
- [x] 0.3 Instalar e inicializar o Prisma; configurar `DATABASE_URL`
- [x] 0.4 Criar `PrismaModule` e `PrismaService` (conexão e shutdown hooks)
- [x] 0.5 Instalar `@nestjs/config` e validar variáveis de ambiente (ex.: Joi ou Zod)
- [x] 0.6 Criar `.env.example` e garantir `.env` no `.gitignore`
- [x] 0.7 Ativar `ValidationPipe` global (`whitelist`, `forbidNonWhitelisted`, `transform`)
- [x] 0.8 Criar `HealthModule` com `GET /health` (checando o banco)
- [x] 0.9 Configurar Swagger em `/docs`
- [x] 0.10 Definir a estrutura de pastas (um módulo por feature) e registrar no README
- [ ] 0.11 Testar manualmente cada critério de aceite do spec

## Definição de pronto
Todos os critérios de aceite do spec 00 marcados.
