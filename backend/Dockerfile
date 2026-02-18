FROM node:22-alpine

WORKDIR /backend

COPY package*.json ./
COPY package-lock.json ./

RUN npm install 

COPY . .

ENV PORT=3001
ENV NODE_ENV='production'
ENV ADMIN_NAME="Portal Super Admin"
ENV ADMIN_EMAIL='admin@studentportal.com'
ENV ADMIN_PASSWORD='admin@123'
EXPOSE 3001

COPY ./entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

CMD ["sh", "./entrypoint.sh"]
