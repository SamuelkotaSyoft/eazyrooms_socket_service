FROM node:18

WORKDIR /usr/src/eazyrooms_socket_service

COPY package*.json ./

COPY . .

RUN npm install

EXPOSE 3013

CMD ["node", "server.js"]