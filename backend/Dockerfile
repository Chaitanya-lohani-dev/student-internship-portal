FROM node:22-alpine

WORKDIR /backend

COPY package*.json ./
COPY package-lock.json ./

RUN npm install --omit=dev

COPY . .

EXPOSE 3001

COPY ./entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

CMD ["sh", "./entrypoint.sh"]
