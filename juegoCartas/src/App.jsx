import React, { useEffect, useState } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import './App.css';
import Baraja from './clases/baraja.jsx';
import Player from './clases/player.jsx';

function Game() {
  const [gameResponse, setGameResponse] = useState('');
  const [players, setPlayers] = useState(''); 

  useEffect(() => {
    const websocket = new ReconnectingWebSocket('ws://localhost:3001');

    websocket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);

      if (message.type === 'joined_game') {
        setGameResponse('Te has unido con éxito a la partida.');
        setPlayers([
          { id: 1, name: 'Jugador 1', cartas: [] },
          { id: 2, name: 'Jugador 2', cartas: [] },
          { id: 3, name: 'Jugador 3', cartas: [] },
          { id: 4, name: 'Jugador 4', cartas: [] }
        ])
      } else if (message.type === 'game_full') {
        setGameResponse('La partida está llena, no puedes unirte.');
      }
    });

    return () => {
      websocket.close();
    };
  }, []);

};

  return (
    <div className="tapete">
        <div className="game">
          <p>{gameResponse}</p>
          <button onClick={dealCards}>Repartir cartas</button>

          <Baraja />
          <div className="players">
              {players.map((player) => (
                  <Player key={player.id} name={player.name} cards={player.cartas} />
              ))}
          </div>
        </div>
    </div>
    
  );

export default Game;
