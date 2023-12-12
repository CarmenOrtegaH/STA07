const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { createDeck, shuffleDeck, findHighestCard } = require('./cards');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const clients = [];

let currentTurn = 1;
let playerCards = {};
let selectedCards = {};
let puntuaciones = {};

// COMENTARIO: Siempre es mejor evitar "números mágicos", y definir constantes.
// Así podríamos cambiar el número de jugadores.
const MAX_PLAYERS = 4;


wss.on('connection', (ws) => {
  // COMENTARIO: Separando estas funciones es mucho ḿas fácil entender la función de conexión.
  if (clients.length < MAX_PLAYERS) {
    joinPlayer(ws);
  }
  else {
    rejectPlayer(ws);
  }
});


function joinPlayer(ws) {
  clients.push(ws);

  ws.send(JSON.stringify({ type: 'joined_game', id: clients.length }));

  ws.on('message', message => onMessage(message, ws));  // COMENTARIO: Esta línea mejor aquí. Si rechazamos al jugador no tiene sentido.

  ws.on('close', () => {
    clients.splice(clients.indexOf(ws), 1);
  });

  if (clients.length === MAX_PLAYERS) {
    for (let i = 1; i <= MAX_PLAYERS; i++) {
      puntuaciones[i] = 0;
    }
    distributeCards();
  }
}

function rejectPlayer(ws) {
  ws.send(JSON.stringify({ type: 'game_full' }));
  ws.close();
}


function onMessage(message, ws) {
  const parsedMessage = JSON.parse(message);

  if (parsedMessage.type === 'select_card') {
    // COMENTARIO: Os ha complicado un pelín la vida no empezar por el 0.
    // No pasa nada, pero es más fácil mantener siempre el 0, hasta el momento en el que lo muestras al jugador,
    // que ahí añades 1 para que sea más "user friendly". Pero vaya, no está mal.
    const playerId = clients.indexOf(ws) + 1;
    const selectedCard = parsedMessage.card;

    if (!selectedCards[playerId - 1] && currentTurn == parsedMessage.turn) {  // COMENTARIO: Bien comprobado!
      selectedCards[playerId - 1] = selectedCard;
      playerCards[playerId - 1].pop(selectedCard);

      if (Object.keys(selectedCards).length === MAX_PLAYERS) {
        playTurn();
        currentTurn++;
        selectedCards = {};
      }
    }
  }
}


function distributeCards() {
    let deck = createDeck();
    shuffleDeck(deck);

    clients.forEach(client => {
        let cartas = [];
        for (let i = 0; i < 7; i++) {
            let card = deck.pop();
            cartas.push(card);
        }

        const playerId = clients.indexOf(client) +1;
        playerCards[playerId - 1] = cartas;

        client.send(JSON.stringify({ type: 'cartas', cartas, id: playerId}));
    });
}


function playTurn() {
    let turnCards = [];

    clients.forEach(client => {
        const playerId = clients.indexOf(client);
        const card = selectedCards[playerId];
        turnCards.push({ playerId, card });
    });

    const highestCard = findHighestCard(turnCards);
    puntuaciones[highestCard.playerId + 1] += 1;

    clients.forEach(client => {
        const playerId = clients.indexOf(client);

        if (playerId === highestCard.playerId) {
            client.send(JSON.stringify({ type: 'win_turn', winner: playerId + 1, scores: puntuaciones }));
        } else {
            client.send(JSON.stringify({ type: 'lose_turn', winner: highestCard.playerId + 1, scores: puntuaciones }));
        }
    });

    if(playerCards[0].length === 0) {
        endGame();
    }
}


function endGame() {
    const scores = clients.map(client => {
        const playerId = clients.indexOf(client);
        const playerScore = puntuaciones[playerId + 1];
        return { playerId, score: playerScore };
    });

    const ganador = scores.reduce((prev, current) => (current.score > prev.score ? current : prev));
    const winner = ganador.playerId + 1;

    clients.forEach(client => {
        client.send(JSON.stringify({ type: 'game_over', puntuaciones, winner, id: clients.indexOf(client) + 1}));
    });
}

server.listen(3001, () => {
  console.log('Servidor WebSocket escuchando en el puerto 3001');
});
