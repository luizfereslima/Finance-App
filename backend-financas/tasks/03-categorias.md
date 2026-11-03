# Tasks: Feature 03 (Categorias)

Spec: specs/03-categorias.md
Depende de: features 01 e 02

- [x] 3.1 Adicionar o model `Category` com `@@unique([userId, name, type])` e a migration
- [x] 3.2 Adicionar a relação opcional `categoryId` em `Transaction` (`onDelete: Restrict`)
- [x] 3.3 Criar `CategoriesModule`, controller e service
- [x] 3.4 Criar DTOs de criação e atualização (nome 1 a 40, tipo enum)
- [x] 3.5 Implementar `POST /categories` (409 se duplicada) e `GET /categories?type=`
- [x] 3.6 Implementar `PATCH /categories/:id` e `DELETE /categories/:id` (409 se em uso)
- [x] 3.7 Validar na criação/edição de transação que o tipo da categoria é igual ao da transação
- [x] 3.8 Criar as categorias padrão ao registrar um novo usuário (dentro de uma transação de banco)
- [x] 3.9 Documentar no Swagger
- [x] 3.10 Escrever testes unitários do `CategoriesService`
- [ ] 3.11 Escrever testes e2e: CRUD, duplicidade, isolamento, exclusão em uso, categorias padrão
- [ ] 3.12 Testar manualmente cada critério de aceite do spec

## Definição de pronto
Todos os critérios de aceite do spec 03 marcados.
