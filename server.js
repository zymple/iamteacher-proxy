// server.js
import express from 'express';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import WebSocket from 'ws';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

wss.on('connection', (clientWs) => {
  const openaiWs = new WebSocket('wss://api.openai.com/v1/realtime', {
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`
    }
  });

  openaiWs.on('open', () => {
    console.log('Connected to OpenAI');
  });

  // Proxy messages from client to OpenAI
  clientWs.on('message', (message) => {
    if (openaiWs.readyState === WebSocket.OPEN) {
      openaiWs.send(message);
    }
  });

  // Proxy messages from OpenAI back to client
  openaiWs.on('message', (message) => {
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(message);
    }
  });

  openaiWs.on('close', () => clientWs.close());
  clientWs.on('close', () => openaiWs.close());
});

server.listen(3001, () => {
  console.log('WebSocket proxy listening on ws://localhost:3001');
});
