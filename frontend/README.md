<h1 align="center">
  <img alt="Financy Logo" src="../.github/logo.svg" height="40px">
</h1>

<h4 align="center">
  Front-end do Financy
</h4>

<p align="center">
  <a href="#-tecnologias">🚀 Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#como-rodar-o-projeto">▶️ Como rodar</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#requisitos">📋 Requisitos</a>
</p>

<br>

Aplicação React (SPA) que consome a API GraphQL do Financy para gerenciar categorias e transações.

## 🚀 Tecnologias

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

## Como rodar o projeto

1. Clone o repositório `git clone https://github.com/brendamatias/financy`;
2. Mova-se para o diretório da aplicação: `cd financy/frontend`;
3. Copie as variáveis de ambiente: `cp .env.example .env`;
4. Execute `npm install`;
5. Inicie a aplicação `npm run dev`;
6. Acesse: http://localhost:5173 🚀

Node 22 (ou ≥ 20.19) — há um `.nvmrc` no projeto.

Se quiser rodar os testes:

```bash
npm run test
```

Se quiser rodar com Docker, use o `docker compose` da raiz do repositório.

## Variáveis de ambiente

| Variável            | Exemplo                         | Descrição                                     |
| ------------------- | ------------------------------- | --------------------------------------------- |
| `VITE_BACKEND_URL`  | `http://localhost:4000/graphql` | Endereço do GraphQL                           |
| `VITE_GRAPHQL_MOCK` | `false`                         | Quando `true`, o MSW responde no lugar da API |

Com `VITE_GRAPHQL_MOCK=true` dá para navegar por toda a aplicação sem subir o back-end: os mocks do MSW respondem às mesmas operações GraphQL.

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

Além disso, também temos algumas regras importantes específicas para o front-end:

- [x] É obrigatória a criação de uma aplicação React usando GraphQL para consultas na API e Vite como `bundler`;
- [x] Siga o mais fielmente possível o layout do Figma;
- [x] Trabalhe com elementos que tragam uma boa experiência ao usuário (`empty state`, ícones de carregamento, bloqueio de ações a depender do estado da aplicação);
- [x] Foco na responsividade: essa aplicação deve ter um bom uso tanto em desktops quanto em celulares.

## Páginas

| Rota               | Página                                         |
| ------------------ | ---------------------------------------------- |
| `/`                | Redireciona para o dashboard ou para o login    |
| `/sign-in`         | Login                                           |
| `/sign-up`         | Criar conta                                     |
| `/dashboard`       | Resumo do mês, últimas transações e categorias  |
| `/transactions`    | Listagem com busca, filtros e paginação         |
| `/categories`      | Listagem de categorias                          |
| `/profile`         | Perfil do usuário                               |
| `/forgot-password` | Solicitar recuperação de senha                  |
| `/reset-password`  | Definir uma nova senha                          |

Modais: formulário de categoria, formulário de transação e confirmação de exclusão.

## Estrutura

```
src
├── components      # componentes da aplicação e a base do design system (ui)
├── layouts         # layout autenticado e layout de autenticação
├── lib             # helpers e a camada de GraphQL (queries, mutations e client)
├── mocks           # handlers do MSW
├── pages           # telas, separadas em app e auth
├── routes          # rotas públicas e protegidas
├── stores          # estado global (autenticação)
└── types           # tipos globais por domínio
```
