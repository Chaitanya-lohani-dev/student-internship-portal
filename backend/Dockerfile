FROM node:22-alpine

WORKDIR /backend

COPY package*.json ./
COPY package-lock.json ./

RUN npm ci 

COPY . .

ENV PORT=3001
ENV NODE_ENV='production'

EXPOSE 3001

COPY ./entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

CMD ["sh", "./entrypoint.sh"]
