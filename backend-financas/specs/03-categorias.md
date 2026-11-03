# Feature 03: Categorias

## Objetivo
Permitir que cada usuário organize suas transações em categorias (ex.: Salário, Mercado, Transporte).

## Modelo: Category
- `id` (uuid)
- `userId` (FK → User)
- `name`: 1 a 40 caracteres
- `type`: `INCOME` | `EXPENSE`
- `createdAt`, `updatedAt`
- Restrição de unicidade: (`userId`, `name`, `type`)

## Endpoints (todos exigem token)
- `POST /categories`: body `{ name, type }`; 201. Duplicada: 409.
- `GET /categories`: lista as categorias do usuário, com filtro opcional `?type=INCOME|EXPENSE`.
- `PATCH /categories/:id`: renomeia. Duplicada: 409. De outro usuário: 404.
- `DELETE /categories/:id`: ver regra abaixo.

## Regras
- Uma transação só pode usar categoria do **mesmo `type`** (despesa não usa categoria de entrada); caso contrário 400. Essa validação entra também na feature 02.
- Excluir categoria em uso: 409 com mensagem explicando que há transações vinculadas.
- Excluir categoria sem uso: 204.
- Ao cadastrar um novo usuário, são criadas categorias padrão (ex.: Salário, Outras entradas, Alimentação, Moradia, Transporte, Lazer, Outras despesas).

## Critérios de aceite
- [ ] CRUD de categorias funciona e é isolado por usuário.
- [ ] Nome duplicado no mesmo tipo e usuário retorna 409; em outro usuário é permitido.
- [ ] Categoria de tipo diferente da transação é rejeitada (400).
- [ ] Excluir categoria em uso retorna 409 e nada é apagado.
- [ ] Novo usuário já nasce com as categorias padrão.
- [ ] Testes e2e cobrem os cenários acima.

## Fora de escopo
- Subcategorias, cores/ícones e reordenação.
