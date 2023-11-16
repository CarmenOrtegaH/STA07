import React, { useEffect, useState } from 'react';
import './App.css';

function Game() {
  const [gameResponse, setGameResponse] = useState('');
  const [players, setPlayers] = useState('');
  const [isTurnWinner, setIsTurnWinner] = useState(false);
  const [scores, setScores] = useState([]);

  useEffect(() => {
    console.log('abrir websocket')
    const websocket = new WebSocket('ws://localhost:3001');

    websocket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);

      if (message.type === 'joined_game') {
        setGameResponse('Te has unido con éxito a la partida.');
      } else if (message.type === 'game_full') {
        setGameResponse('La partida está llena, no puedes unirte.');
      }

      if (message.type === 'cartas') {
        setPlayers(message.cartas);
      }

      if (message.type === 'win_turn') {
        setIsTurnWinner(true);
      }

      if (message.type === 'game_over') {
          setScores(message.scores);
      }
    });

    return () => {
      websocket.close();
    };
  }, []);


  return (
    <div>
        <p>{gameResponse}</p>
        {players && (
            <div>
                <p>Cartas de los jugadores: {JSON.stringify(players)}</p>
                {isTurnWinner && <p>Ganaste el turno.</p>}
            </div>
        )}
        {scores.length > 0 && (
            <div>
                <p>Puntuaciones finales:</p>
                <ul>
                    {scores.map(score => (
                        <li key={score.playerId}>{`Jugador ${score.playerId + 1}: ${score.score} puntos`}</li>
                    ))}
                </ul>
            </div>
        )}
    </div>
  );
}

export default Game;
