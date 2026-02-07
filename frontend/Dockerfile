FROM node:22-alpine

WORKDIR /frontend

COPY package*.json ./
COPY package-lock.json ./
COPY .Dockerignore ./

RUN npm install

COPY next.config.ts next.config.ts
COPY eslint.config.mjs eslint.config.mjs
COPY next-env.d.ts next-env.d.ts
COPY postcss.config.mjs postcss.config.mjs
COPY tsconfig.json tsconfig.json
COPY ./app ./app
COPY ./public ./public

RUN npm run build

EXPOSE 3000

CMD ["npm","run","start"]
