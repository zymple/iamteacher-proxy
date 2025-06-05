FROM docker.io/library/node:latest

RUN npm i

CMD node server.js