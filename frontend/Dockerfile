FROM node:22-alpine

WORKDIR /frontend

COPY package*.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

ENV EDGE_STORE_ACCESS_KEY=dummy_access_key
ENV EDGE_STORE_SECRET_KEY=dummy_secret_key
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
RUN npm run build

EXPOSE 3000

CMD ["npm","run","start"]
