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
let selectedCards = {};

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

    ws.on('message', (message) => {
        const parsedMessage = JSON.parse(message);

        if (parsedMessage.type === 'select_card') {
            const playerId = clients.indexOf(ws);
            const selectedCard = parsedMessage.card;

            if (
                playerCards[playerId].includes(selectedCard) &&
                !selectedCards[playerId] &&
                currentTurn === parsedMessage.turn
            ) {
                selectedCards[playerId] = selectedCard;

                if (Object.keys(selectedCards).length === 4) {
                    playTurn();
                    selectedCards = {};
                }
            }
        }
    });
});

wss.on('error', (err) => {
    console.log('Error: ', err);
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
        const card = selectedCards[playerId];
        turnCards.push({ playerId, card });
    });

    const highestCard = findHighestCard(turnCards);

    clients.forEach(client => {
        const playerId = clients.indexOf(client);
        if (playerId === highestCard.playerId) {
            client.send(JSON.stringify({ type: 'win_turn', winner: playerId }));
        } else {
            client.send(JSON.stringify({ type: 'lose_turn', winner: highestCard.playerId }));
        }
    });

    currentTurn++;

    if (currentTurn > 7) {
        endGame();
    }
}


function findHighestCard(turnCards) {
    return turnCards.reduce((prev, current) => {
        const currentCardValue = current.card ? current.card[1] : 0;
        const prevCardValue = prev.card ? prev.card[1] : 0;
        return currentCardValue > prevCardValue ? current : prev;
    });
}

function endGame() {
    const scores = clients.map(client => {
        const playerId = clients.indexOf(client);
        const playerScore = 7 - (playerCards[playerId] ? playerCards[playerId].length : 0);
        return { playerId, score: playerScore };
    });

    const winner = scores.reduce((prev, current) => (current.score > prev.score ? current : prev));

    clients.forEach(client => {
        const playerId = clients.indexOf(client);
        client.send(JSON.stringify({ type: 'game_over', scores, winner }));
    });
}

server.listen(3001, () => {
  console.log('Servidor WebSocket escuchando en el puerto 3001');
});
