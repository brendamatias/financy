<h1 align="center">
  <img alt="Financy Logo" src="../.github/logo.svg" height="40px">
</h1>

<h4 align="center">
  Back-end do Financy
</h4>

<p align="center">
  <a href="#-tecnologias">🚀 Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#como-começar">▶️ Como começar</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#requisitos">📋 Requisitos</a>
</p>

<br>

API GraphQL que gerencia usuários, categorias e transações do Financy, com autenticação por JWT.

## 🚀 Tecnologias

- Node.js
- TypeScript
- Apollo Server + Express
- TypeGraphQL
- Prisma
- SQLite
- Zod
- JWT + bcrypt
- Vitest

## Como começar

Se quiser rodar o projeto com Docker (na raiz do repositório):

```bash
docker compose up -d
```

Se quiser rodar localmente:

```bash
cp .env.example .env
npm install
npm run migrate
npm run dev
```

Se quiser rodar os testes:

```bash
npm run test
```

A API sobe em http://localhost:4000/graphql e o health check responde em http://localhost:4000/health. Node 22 (ou ≥ 20.19) — há um `.nvmrc` no projeto.

## Variáveis de ambiente

| Variável       | Exemplo                 | Descrição                                |
| -------------- | ----------------------- | ---------------------------------------- |
| `DATABASE_URL` | `file:./dev.db`         | Caminho do banco SQLite                  |
| `JWT_SECRET`   | `troque-esse-valor`     | Segredo usado para assinar os tokens     |
| `APP_URL`      | `http://localhost:5173` | Base do link de recuperação de senha     |
| `PORT`         | `4000`                  | Porta da API (opcional)                  |
| `CORS_ORIGIN`  | `http://localhost:5173` | Origens liberadas, separadas por vírgula |

## Scripts

| Script                   | O que faz                                    |
| ------------------------ | -------------------------------------------- |
| `npm run dev`            | Sobe a API com hot reload                     |
| `npm start`              | Sobe a API                                    |
| `npm run migrate`        | Cria e aplica migrations em desenvolvimento   |
| `npm run migrate:deploy` | Aplica as migrations existentes               |
| `npm run generate`       | Regenera o Prisma Client                      |
| `npm run test`           | Roda os testes                                |

## Requisitos

- [x] O usuário pode criar uma conta e fazer login
- [x] O usuário pode ver e gerenciar apenas as transações e categorias criadas por ele
- [x] Deve ser possível criar uma transação
- [x] Deve ser possível deletar uma transação
- [x] Deve ser possível editar uma transação
- [x] Deve ser possível listar todas as transações
- [x] Deve ser possível criar uma categoria
- [x] Deve ser possível deletar uma categoria
- [x] Deve ser possível editar uma categoria
- [x] Deve ser possível listar todas as categorias

Requisitos não funcionais:

- [x] TypeScript
- [x] GraphQL
- [x] Prisma
- [x] SQLite
- [x] CORS habilitado na aplicação
- [x] Arquivo `.env.example` com as chaves necessárias

## API

Todas as operações, exceto as de autenticação, exigem o header `Authorization: Bearer <token>`.

### Queries

| Operação                 | Descrição                                             |
| ------------------------ | ----------------------------------------------------- |
| `me`                     | Dados do usuário autenticado                          |
| `listCategories`         | Categorias do usuário, com total e nº de transações   |
| `getCategory`            | Uma categoria                                         |
| `getCategoriesSummary`   | Resumo das categorias                                 |
| `listTransactions`       | Transações com busca, filtros e paginação             |
| `getTransaction`         | Uma transação                                         |
| `listTransactionPeriods` | Períodos (MM/AAAA) que possuem transações             |
| `getDashboardSummary`    | Saldo, receitas e despesas do período                 |

### Mutations

| Operação                | Descrição                                        |
| ----------------------- | ------------------------------------------------ |
| `register`              | Cria a conta e retorna os tokens                 |
| `login`                 | Autentica e retorna os tokens                    |
| `refreshToken`          | Gera um novo par de tokens                       |
| `requestPasswordReset`  | Gera o token de recuperação de senha             |
| `resetPassword`         | Define uma nova senha a partir do token          |
| `updateMe`              | Atualiza o perfil                                |
| `createCategory`        | Cria uma categoria                               |
| `updateCategory`        | Edita uma categoria                              |
| `deleteCategory`        | Remove uma categoria                             |
| `createTransaction`     | Cria uma transação                               |
| `updateTransaction`     | Edita uma transação                              |
| `deleteTransaction`     | Remove uma transação                             |

## Estrutura

```
src
├── dtos          # inputs do GraphQL
├── graphql       # contexto, enums e decorators
├── middlewares   # autenticação
├── models        # tipos de retorno do GraphQL
├── resolvers     # entrada das queries e mutations
├── schemas       # validações com Zod
├── services      # regras de negócio
├── tests         # setup e factories
└── utils         # hash, jwt, período e validação
```

## Recuperar senha

Não há serviço de e-mail no projeto. Ao pedir a recuperação, o link é impresso no console do servidor:

```
======================= RECUPERAR SENHA =======================
e-mail: maria@teste.com
link:   http://localhost:5173/reset-password?token=8f3c...
===============================================================
```
