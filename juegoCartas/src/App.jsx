import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import Card from './clases/Card';

function Game() {
  const [gameResponse, setGameResponse] = useState('');
  const [cartas, setcartas] = useState('');
  const [isTurnWinner, setIsTurnWinner] = useState(false);
  const [scores, setScores] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(1);
  const [clickedCard, setClickedCard] = useState(null);

  const websocketRef = useRef(null);
  const clientsRef = useRef([]);

  function handleMessage(message) {
    if (message.type === 'joined_game') {
      setGameResponse('Te has unido con éxito a la partida.');
    } else if (message.type === 'game_full') {
      setGameResponse('La partida está llena, no puedes unirte.');
      ws.close();
    }

    if (message.type === 'cartas') {
      setGameResponse(null);
      setcartas(message.cartas);
    }

    if (message.type === 'win_turn' || message.type === 'lose_turn') {
      cartaClick = null;
      setClickedCard(null);
      setScores(message.scores);
    } 
    
    if (message.type === 'game_over') {
        setScores(message.scores);
        if (message.winner === clientsRef.current.indexOf(websocketRef.current)) {
            setGameResponse('¡Has ganado la partida!');
        } else {
            setGameResponse('¡Has perdido la partida!');
        }
    }
  }

  useEffect(() => {
    console.log('abrir websocket');
    const ws = new WebSocket('ws://localhost:3001');
    websocketRef.current = ws;

    ws.addEventListener('open', () => {
      console.log('websocket abierto');
    });

    ws.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      handleMessage(message);
    });

    ws.addEventListener('close', () => {
      console.log('websocket cerrado');
    });

    return () => {
      ws.close();
    };
  }, []);

  let cartaClick = null;

  const handleCardClick = (card) => {
    if (!clickedCard) {
        setClickedCard(card);
        cartaClick = card;
        console.log("turno antes de mandar el mensaje", currentTurn);
        setcartas(oldCartas => {
          const updatedCartas = oldCartas.filter((carta) => carta[0] !== cartaClick[0] || carta[1] !== cartaClick[1]);
          const selectedCardMessage = JSON.stringify({ type: 'select_card', card, turn: currentTurn });
          websocketRef.current.send(selectedCardMessage);
          setCurrentTurn(currentTurn + 1);
          return updatedCartas;
      });

    }
  };

  const playerId = clientsRef.current.indexOf(websocketRef.current) + 1;

  return (
    <div>
      <p className="mensajeInicial"> {gameResponse} </p>

      <div className="barraPuntuaciones">
        {scores && Object.keys(scores).map(player => (
          <p key={player}>{`Jugador ${player}: ${scores[player]} puntos`} </p>
        ))}

        {`Turno: ${currentTurn}`}
      </div>

      <p className="numeroJugador"> {playerId} </p>
      {cartas && (
        <div>
          <div className="player-hand">
            {cartas.map((card, index) => (
              <Card
                key={index} suit={card[0]} number={card[1]} onClick={() => handleCardClick(card)} />
            ))}
          </div>
          {isTurnWinner && 
            <p>Ganaste el turno.</p>
          }
        </div>
      )}

      {scores.length > 0 && (
        <div>
          <p>Puntuaciones finales:</p>
          <ul>
            {scores.map((score) => (
              <li key={score.playerId}>{`Jugador ${score.playerId}: ${score.score} puntos`}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Game;

