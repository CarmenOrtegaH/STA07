const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const clients = [];

let gameStarted = false;
let currentTurn = 1;
let playerCards = {};

wss.on('connection', (ws) => {
    console.log('Cliente conectado');
    if (clients.length < 4) {
        clients.push(ws);
        ws.send(JSON.stringify({ type: 'joined_game', id: clients.length}));

        ws.on('close', () => {
            clients.splice(clients.indexOf(ws), 1);
            console.log('Cliente desconectado');
        });

        if (clients.length === 4) {
            console.log('Juego lleno');
            distributeCards();
            startGame();
        }
    }
    else {
        ws.send(JSON.stringify({ type: 'game_full' }));
        ws.close();
    }

});

function distributeCards() {
    let deck = createDeck();
    shuffleDeck(deck);

    clients.forEach(client => {
        let cartas = [];
        for (let i = 0; i < 7; i++) {
            let card = deck.pop();
            cartas.push(card);
        }

        const playerId = clients.indexOf(client);
        playerCards[playerId] = cartas;

        client.send(JSON.stringify({ type: 'cartas', cartas, id: clients.indexOf(client)}));
    });
}

function createDeck() {
    let deck = [];
    const palos = ['diamond', 'heart', 'club', 'spade'];
    const values = ['2','3','4','5','6','7','8','9','10','J','Q','K','A']

    for (let palo of palos) {
        for (let value of values) {
            deck.push([palo, value]);
        }
    }
    return deck;
}

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function startGame() {
    const maxTurns = 7;

    while (currentTurn <= maxTurns) {
        playTurn();
        currentTurn++;
    }

    endGame();
}

function playTurn() {
    let turnCards = [];

    clients.forEach(client => {
        const playerId = clients.indexOf(client);
        const card = playerCards[playerId].pop();
        turnCards.push({ playerId, card });
    });

    const highestCard = findHighestCard(turnCards);

    clients.forEach(client => {
        const playerId = clients.indexOf(client);
        if (playerId === highestCard.playerId) {
            // Player with the highest card wins the turn
            client.send(JSON.stringify({ type: 'win_turn' }));
        }
    });
}

function findHighestCard(turnCards) {
    // Implement logic to find the highest card in the current turn
    // For simplicity, let's assume the highest card is the one with the highest value
    return turnCards.reduce((prev, current) => {
        return current.card[1] > prev.card[1] ? current : prev;
    });
}

function endGame() {
    // Implement logic to calculate and send final scores to clients
    // For simplicity, let's assume each player gets 1 point for each turn won
    const scores = clients.map(client => {
        const playerId = clients.indexOf(client);
        return { playerId, score: 7 - playerCards[playerId].length }; // 7 turns - remaining cards
    });

    clients.forEach(client => {
        const playerId = clients.indexOf(client);
        client.send(JSON.stringify({ type: 'game_over', scores }));
    });
}

server.listen(3001, () => {
  console.log('Servidor WebSocket escuchando en el puerto 3001');
});
