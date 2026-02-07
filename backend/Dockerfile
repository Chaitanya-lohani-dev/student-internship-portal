FROM node:22-alpine

WORKDIR /backend

COPY package*.json ./
COPY package-lock.json
COPY .Dockerignore ./

RUN npm ci 

COPY server.js 
COPY ./config ./config
COPY ./models ./models
COPY ./middleware ./middleware
COPY ./utils ./utils
COPY ./routes ./routes
COPY ./controllers ./controllers

ENV PORT=3001
ENV NODE_ENV='production'

EXPOSE 3001

CMD ["node", "server.js"]
