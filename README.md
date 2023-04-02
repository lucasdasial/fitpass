# APP

Fitpass é uma aplicação genérica do gympass

## Requisitos funcionais

- [ ] Deve ser possível se cadastrar
- [ ] Deve ser possível se autenticar
- [ ] Deve ser possível obter o perfil de um usuário
- [ ] Deve ser possível obter o numero de vezes de check-in
- [ ] Deve ser possível usuário obter o histórico de check-in
- [ ] Deve ser possível usuário buscar academias próximas
- [ ] Deve ser possível usuário buscar academias pelo nome
- [ ] Deve ser possível usuário fazer check-in em uma academia
- [ ] Deve ser possível validar o check-in de um usuário
- [ ] Deve ser possível cadastrar uma academia

## Regras de negocio

- [ ] O usuário nao pode fazer 2 check-ins no mesmo dia
- [ ] O usuário so pode fazer check-in quando estiver a 100m de distancia da academia
- [ ] O check-in so pode ser validado em ate 20 min apos ser criado
- [ ] O check-in so pode ser validado admins
- [ ] A academia so pode ser cadastrada por admins

## Requisitos não funcionais

- [ ] a senha de usuário deve estar criptografia
- [ ] Todas listas de dados devem estar paginados em 20 itens por pagina
- [ ] O usuário deve ser identificado por um JWT
