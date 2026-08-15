<h1 align="center">
  <img alt="Financy Logo" src=".github/logo.svg" height="40px">
</h1>

<h4 align="center">
  Gerenciador de Finanças Pessoais
</h4>

<p align="center">
  <a href="#-projeto">💻 Projeto</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-tecnologias">🚀 Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-requisitos">📋 Requisitos</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-executando-o-projeto">🐳 Executando</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-testes">🧪 Testes</a>
</p>

<br>

## 💻 Projeto

Aplicação fullstack desenvolvida como projeto da Pós-Graduação Tech Developer 360 pela Rocketseat, com foco na organização das finanças pessoais: cadastro de categorias, lançamento de receitas e despesas e acompanhamento do saldo do mês.

O projeto é dividido em duas pastas:

- **`backend`** — API GraphQL com autenticação JWT
- **`frontend`** — SPA em React consumindo a API via Apollo Client

## 🚀 Tecnologias

Esse projeto foi desenvolvido com as seguintes tecnologias:

### Front-end

- React
- Vite
- TypeScript
- TailwindCSS
- shadcn/ui
- Apollo Client (GraphQL)
- React Hook Form
- Zod
- Zustand
- MSW
- Vitest + Testing Library

### Back-end

- Node.js
- TypeScript
- Apollo Server + Express
- TypeGraphQL
- Prisma
- SQLite
- Zod
- JWT + bcrypt
- Vitest

### DevOps

- Docker
- Docker Compose
- Nginx

## 📋 Requisitos

### Back-end

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

### Front-end

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

Regras específicas do front-end:

- [x] Aplicação React no formato SPA utilizando o Vite como `bundler`
- [x] GraphQL para as consultas na API
- [x] Layout seguindo o Figma
- [x] Boa experiência de uso (`empty state`, `skeletons`, bloqueio de ações conforme o estado)
- [x] Responsividade em desktop e celular
- [x] Arquivo `.env.example` com as chaves necessárias

### Páginas

| Rota                | Página                                        |
| ------------------- | --------------------------------------------- |
| `/`                 | Redireciona para o dashboard ou para o login   |
| `/sign-in`          | Login                                          |
| `/sign-up`          | Criar conta                                    |
| `/dashboard`        | Resumo do mês, últimas transações e categorias |
| `/transactions`     | Listagem com busca, filtros e paginação        |
| `/categories`       | Listagem de categorias                         |
| `/profile`          | Perfil do usuário                              |
| `/forgot-password`  | Solicitar recuperação de senha                 |
| `/reset-password`   | Definir uma nova senha                         |

Modais: formulário de categoria, formulário de transação e confirmação de exclusão.

## ✨ Além do desafio

- [x] Refresh token automático quando o token de acesso expira
- [x] Fluxo de recuperação de senha (token de uso único com validade de 1 hora)
- [x] "Lembrar-me" guardando a sessão e o e-mail entre acessos
- [x] Ambiente completo em Docker, com healthcheck e migrations no start
- [x] Mocks com MSW para rodar o front sem a API
- [x] Testes unitários nas duas pontas

## 🐳 Executando o projeto

### Com Docker

Pré-requisitos: Docker e Docker Compose.

```bash
cp .env.example .env   # ajuste o JWT_SECRET
docker compose up -d --build
```

| Serviço | Endereço                          |
| ------- | --------------------------------- |
| App     | http://localhost:8080             |
| GraphQL | http://localhost:4000/graphql     |
| Health  | http://localhost:4000/health      |

O banco SQLite fica no volume `financy-data` (`/app/data/financy.db` dentro do container), então os dados sobrevivem a um `docker compose down`. As migrations rodam sozinhas no start, via `prisma migrate deploy`.

Para derrubar tudo, incluindo o banco:

```bash
docker compose down -v
```

Modo desenvolvimento, com hot reload e o código montado da máquina (app em http://localhost:5173):

```bash
docker compose -f docker-compose.dev.yml up --build
```

### Sem Docker

Node 22 (ou ≥ 20.19) nos dois projetos — há um `.nvmrc` em cada um.

```bash
# back-end
cd backend
cp .env.example .env
npm install
npm run migrate
npm run dev

# front-end
cd frontend
cp .env.example .env
npm install
npm run dev
```

## 🔑 Variáveis de ambiente

### `backend/.env`

| Variável       | Exemplo                   | Descrição                                       |
| -------------- | ------------------------- | ----------------------------------------------- |
| `DATABASE_URL` | `file:./dev.db`           | Caminho do banco SQLite                         |
| `JWT_SECRET`   | `troque-esse-valor`       | Segredo usado para assinar os tokens            |
| `APP_URL`      | `http://localhost:5173`   | Base do link de recuperação de senha            |
| `PORT`         | `4000`                    | Porta da API (opcional)                         |
| `CORS_ORIGIN`  | `http://localhost:5173`   | Origens liberadas, separadas por vírgula        |

### `frontend/.env`

| Variável            | Exemplo                         | Descrição                                    |
| ------------------- | ------------------------------- | -------------------------------------------- |
| `VITE_BACKEND_URL`  | `http://localhost:4000/graphql` | Endereço do GraphQL                          |
| `VITE_GRAPHQL_MOCK` | `false`                         | Quando `true`, o MSW responde no lugar da API |

### `.env` da raiz (Docker Compose)

| Variável            | Padrão                          | Descrição                                          |
| ------------------- | ------------------------------- | -------------------------------------------------- |
| `JWT_SECRET`        | —                               | Obrigatória                                         |
| `APP_PORT`          | `8080`                          | Porta do app na máquina                             |
| `SERVER_PORT`       | `4000`                          | Porta da API na máquina                             |
| `VITE_BACKEND_URL`  | `http://localhost:4000/graphql` | Aplicada **no build** do app                        |
| `VITE_GRAPHQL_MOCK` | `false`                         | Usa os mocks do MSW no lugar da API                 |
| `CORS_ORIGIN`       | `http://localhost:8080`         | Origens liberadas na API                            |
| `APP_URL`           | `http://localhost:8080`         | Base do link de recuperação de senha                |

`VITE_BACKEND_URL` entra na imagem em tempo de build. Se mudar esse valor, reconstrua o app com `docker compose up -d --build app`.

## 🧪 Testes

```bash
cd backend && npm test   # 97 testes
cd frontend && npm test      # 165 testes
```

## 📨 Recuperar senha

Não há serviço de e-mail no projeto. Ao pedir a recuperação, o link é impresso no console do servidor (`docker compose logs -f server`, quando estiver rodando em container):

```
======================= RECUPERAR SENHA =======================
e-mail: maria@teste.com
link:   http://localhost:8080/reset-password?token=8f3c...
===============================================================
```
