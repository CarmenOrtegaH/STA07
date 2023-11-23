import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import Card from './clases/Card';

function Game() {
  const [gameResponse, setGameResponse] = useState('');
  const [cartas, setcartas] = useState('');
  const [isTurnWinner, setIsTurnWinner] = useState(false);
  const [scores, setScores] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(1); // Agregamos currentTurn aquí
  const [clickedCard, setClickedCard] = useState(null);

  const websocketRef = useRef(null);
  const clientsRef = useRef([]);

  useEffect(() => {
    console.log('abrir websocket');
    websocketRef.current = new WebSocket('ws://localhost:3001');

    websocketRef.current.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);

      if (message.type === 'joined_game') {
        setGameResponse('Te has unido con éxito a la partida.');
      } else if (message.type === 'game_full') {
        setGameResponse('La partida está llena, no puedes unirte.');
      }

      if (message.type === 'cartas') {
        setcartas(message.cartas);
      }

      if (message.type === 'win_turn') {
        setIsTurnWinner(message.winner === clientsRef.current.indexOf(websocketRef.current));
        setCurrentTurn(currentTurn + 1);
      } else if (message.type === 'lose_turn') {
          setIsTurnWinner(false);
          setCurrentTurn(currentTurn + 1);
      } else if (message.type === 'game_over') {
          setScores(message.scores);
          if (message.winner === clientsRef.current.indexOf(websocketRef.current)) {
              setGameResponse('¡Has ganado la partida!');
          } else {
              setGameResponse('¡Has perdido la partida!');
          }
      }
    });

    return () => {
      websocketRef.current.close();
    };
  }, [currentTurn]);

  const handleCardClick = (card) => {
    if (!isTurnWinner) {
        setClickedCard(card);
        const selectedCardMessage = JSON.stringify({ type: 'select_card', card, turn: currentTurn });
        websocketRef.current.send(selectedCardMessage);
        setIsTurnWinner(false); 
    }
};

  return (
    <div>
      <p>{gameResponse}</p>
      {cartas && (
        <div>
          <div className="player-hand">
            {cartas.map((card, index) => (
              <Card key={index} suit={card[0]} number={card[1]} onClick={() => handleCardClick(card)} />
            ))}
          </div>
          {isTurnWinner && <p>Ganaste el turno.</p>}
        </div>
      )}
      {scores.length > 0 && (
        <div>
          <p>Puntuaciones finales:</p>
          <ul>
            {scores.map((score) => (
              <li key={score.playerId}>{`Jugador ${score.playerId + 1}: ${score.score} puntos`}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Game;

