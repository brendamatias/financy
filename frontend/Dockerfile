FROM node:22-bookworm-slim AS deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

FROM deps AS dev

ENV NODE_ENV=development

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

FROM deps AS build

ARG VITE_BACKEND_URL=http://localhost:4000/graphql
ARG VITE_GRAPHQL_MOCK=false

ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_GRAPHQL_MOCK=$VITE_GRAPHQL_MOCK

COPY . .

RUN npm run build

FROM nginx:1.29-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
