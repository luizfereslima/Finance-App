# Tasks: Feature 01 (Cadastro e autenticação)

Spec: specs/01-autenticacao.md
Depende de: feature 00

- [x] 1.1 Adicionar o model `User` no `schema.prisma` e criar a migration
- [x] 1.2 Criar `UsersModule` e `UsersService` (`create`, `findByEmail`, `findById`)
- [x] 1.3 Criar `RegisterDto` com validações (nome, e-mail, senha mínima 8)
- [x] 1.4 Implementar hash de senha (bcrypt ou argon2) e normalização do e-mail
- [x] 1.5 Implementar `POST /auth/register` com 409 para e-mail duplicado
- [x] 1.6 Criar `LoginDto` e implementar `POST /auth/login` com `@nestjs/jwt`
- [x] 1.7 Garantir mensagem de erro idêntica para e-mail inexistente e senha errada
- [x] 1.8 Criar `JwtStrategy` (Passport) e `JwtAuthGuard` global
- [x] 1.9 Criar o decorator `@Public()` e aplicar em `/auth/*` e `/health`
- [x] 1.10 Criar o decorator `@CurrentUser()` para extrair o `userId` do token
- [x] 1.11 Implementar `GET /users/me` sem expor `passwordHash`
- [x] 1.12 Documentar os endpoints no Swagger (com autenticação Bearer)
- [x] 1.13 Escrever testes unitários do `AuthService`
- [ ] 1.14 Escrever testes e2e: registro, duplicado, login ok/erro, rota protegida
- [ ] 1.15 Testar manualmente cada critério de aceite do spec

## Definição de pronto
Todos os critérios de aceite do spec 01 marcados.
