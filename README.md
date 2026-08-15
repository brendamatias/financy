# Financy

Aplicação de controle financeiro pessoal, dividida em dois projetos:

- **financy-app** — React 19 + Vite + Tailwind + Apollo Client
- **financy-server** — Express + Apollo Server + type-graphql + Prisma (SQLite)

## Rodando com Docker

Pré-requisitos: Docker e Docker Compose.

```bash
cp .env.example .env   # ajuste o JWT_SECRET
docker compose up -d --build
```

- App: http://localhost:8080
- GraphQL: http://localhost:4000/graphql
- Health: http://localhost:4000/health

O banco SQLite fica no volume `financy-data` (`/app/data/financy.db` dentro do
container), então os dados sobrevivem a `docker compose down`. As migrations
rodam sozinhas no start, via `prisma migrate deploy`.

Para derrubar tudo, incluindo o banco:

```bash
docker compose down -v
```

### Variáveis de ambiente

| Variável            | Padrão                          | Onde é usada                                        |
| ------------------- | ------------------------------- | --------------------------------------------------- |
| `JWT_SECRET`        | —                               | assinatura dos tokens (obrigatória)                  |
| `APP_PORT`          | `8080`                          | porta do app na máquina                              |
| `SERVER_PORT`       | `4000`                          | porta da API na máquina                              |
| `VITE_BACKEND_URL`  | `http://localhost:4000/graphql` | endereço do GraphQL, aplicado **no build** do app    |
| `VITE_GRAPHQL_MOCK` | `false`                         | quando `true`, o app responde pelo MSW no browser    |
| `CORS_ORIGIN`       | `http://localhost:8080`         | origens liberadas na API (separadas por vírgula)     |
| `APP_URL`           | `http://localhost:8080`         | base do link enviado no fluxo de recuperar senha     |

`VITE_BACKEND_URL` entra na imagem em tempo de build. Se mudar esse valor,
reconstrua o app: `docker compose up -d --build app`.

### Modo desenvolvimento

Sobe os dois projetos com hot reload, montando o código da máquina:

```bash
docker compose -f docker-compose.dev.yml up --build
```

- App: http://localhost:5173
- GraphQL: http://localhost:4000/graphql

## Rodando sem Docker

```bash
# server
cd financy-server
npm install
npm run migrate
npm run dev

# app
cd financy-app
npm install
npm run dev
```

Node 22 (ou ≥ 20.19) é necessário nos dois projetos — há um `.nvmrc` em cada um.

## Testes

```bash
cd financy-server && npm test
cd financy-app && npm test
```

## Recuperar senha

Não há serviço de e-mail no projeto. Ao pedir a recuperação, o link é impresso
no console do servidor:

```
======================= RECUPERAR SENHA =======================
e-mail: maria@teste.com
link:   http://localhost:8080/reset-password?token=8f3c...
===============================================================
```

Com Docker: `docker compose logs -f server`.
