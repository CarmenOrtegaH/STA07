const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const clients = [];

wss.on('connection', (ws) => {
    if (clients.length < 4) {
        clients.push(ws);
        ws.send(JSON.stringify({ type: 'joined_game' }));

        ws.on('message', (message) => {
            console.log(`Mensaje recibido: ${message}`);
        });

        ws.on('close', () => {
            clients.splice(clients.indexOf(ws), 1);
            console.log('Cliente desconectado');
        });
    }
    else {
        ws.send(JSON.stringify({ type: 'game_full' }));
        ws.close();
    }

});

function distributeCards() {
    let deck = createDeck();
    shuffleDeck(deck);

    for (let i = 0; i < 7; i++) {
        clients.forEach(client => {
            let card = deck.pop();
            client.send(JSON.stringify({ type: 'card', card }));
        });
    }
}

function createDeck() {
    let deck = [];
    for (let i = 1; i <= 12; i++) {
        deck.push(i);
    }
    return deck;
}

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// Llama a la función distributeCards() después de que se conecten todos los jugadores
if (clients.length === 4) {
    distributeCards();
}


server.listen(3001, () => {
  console.log('Servidor WebSocket escuchando en el puerto 3001');
});
