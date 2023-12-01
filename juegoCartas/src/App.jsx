import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import Card from './clases/Card';

function Game() {
  const [gameResponse, setGameResponse] = useState('');
  const [cartas, setcartas] = useState('');
  const [scores, setScores] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(1);
  const [clickedCard, setClickedCard] = useState(null);
  const [id, setId] = useState(0);

  const websocketRef = useRef(null);

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
      setId(message.id);
      setScores({1: 0, 2: 0, 3: 0, 4: 0});
    }

    if (message.type === 'win_turn' || message.type === 'lose_turn') {
      cartaClick = null;
      setClickedCard(null);
      setScores(message.scores);
    } 
    
    if (message.type === 'game_over') {
      setScores(message.puntuaciones);
      if (message.winner == (message.id)) {
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

          if (updatedCartas.length === 0) {
            return updatedCartas;
          }
          else {
            setCurrentTurn(currentTurn + 1);
            return updatedCartas;
          }
      });

    }
  };

  return (
    <div>
      <p className="mensajeInicial"> {gameResponse} </p>

      <div className="barraPuntuaciones">
        {scores && Object.keys(scores).map(player => (
          <p key={player}>{`Jugador ${player}: ${scores[player]} puntos`} </p>
        ))}

        {`Turno: ${currentTurn}`}
      </div>

      <p className="numeroJugador"> {`Jugador: ${id}`} </p>
      {cartas && (
        <div>
          <div className="player-hand">
            {cartas.map((card, index) => (
              <Card
                key={index} suit={card[0]} number={card[1]} onClick={() => handleCardClick(card)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Game;

