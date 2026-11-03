# Feature 01: Cadastro e autenticação

## Objetivo
Permitir que um usuário crie conta e faça login, e proteger as rotas financeiras com JWT.

## Modelo: User
- `id` (uuid), `name`, `email` (único), `passwordHash`, `createdAt`, `updatedAt`

## Endpoints
### `POST /auth/register`
- Body: `{ name, email, password }`
- Regras: `name` 2 a 80 caracteres; `email` válido; `password` mínimo 8 caracteres.
- Sucesso: 201 com `{ id, name, email }`.
- E-mail já cadastrado: 409.
- Dados inválidos: 400.

### `POST /auth/login`
- Body: `{ email, password }`
- Sucesso: 200 com `{ accessToken }`.
- Credenciais erradas (e-mail ou senha): 401 com a **mesma** mensagem nos dois casos.

### `GET /users/me`
- Requer token. Retorna `{ id, name, email, createdAt }`.

## Regras
- Senha guardada com hash bcrypt (ou argon2), nunca em texto puro.
- E-mail normalizado em minúsculas antes de salvar e comparar.
- Token JWT carrega `sub` (id do usuário) e expira conforme `JWT_EXPIRES_IN`.
- Um `JwtAuthGuard` protege todas as rotas, exceto as marcadas como públicas (`/auth/*`, `/health`).

## Critérios de aceite
- [ ] Registro cria usuário e a senha no banco é um hash.
- [ ] E-mail duplicado (inclusive com maiúsculas diferentes) retorna 409.
- [ ] Login correto devolve token válido; incorreto devolve 401.
- [ ] Rota protegida sem token ou com token inválido/expirado retorna 401.
- [ ] Nenhuma resposta contém `passwordHash`.
- [ ] Testes e2e cobrem registro, login e acesso protegido.

## Fora de escopo
- Refresh token, recuperação de senha, confirmação de e-mail e login social.
