FROM docker.io/library/node:latest

RUN mkdir /opt/ai-backend-proxy
COPY . /opt/ai-backend-proxy

WORKDIR /opt/ai-backend-proxy
RUN npm i
CMD node server.js