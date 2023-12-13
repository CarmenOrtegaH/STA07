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
    // COMENTARIO: Esto está bien, pero os cuento cómo hubiera hecho yo esta parte:
    // Definiría funciones para cada uno de los tipos de mensaje, por ejemplo joinGameHandler.
    // Despúes crearía un mapa de message_type -> handler. Algo así:
    //
    // const handlers = {
    //   joined_game: joinGameHandler,
    //   cartas: cartasHandler,
    //   win_turn: turnEndHandler,
    //   lose_turn: turnEndHandler,
    //   game_over: gameOverHandler
    // }
    // const handler = handlers[message.type];
    // handler();
    //
    // Así no tienes que ponerte a hacer if-elses. Además, ahora mismo si entra en el if de message.type === 'joined_game',
    // después seguirá comprobando los otros ifs. Que no pasa nada, en realidad, está bastante claro como lo tenéis.

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

    // COMENTARIO: Bueno, para lo que hace esto, se podría borrar.
    ws.addEventListener('open', () => {
      console.log('websocket abierto');
    });

    ws.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      handleMessage(message);
    });

    // COMENTARIO: Esto también se podría borrar, pero no problem.
    ws.addEventListener('close', () => {
      console.log('websocket cerrado');
    });

    // COMENTARIO: Buen cleanup! No hace mucha falta pero es una buenísima práctica, cerrar el websocket cuando se desmonta el componente.
    return () => {
      ws.close();
    };
  }, []);

  // COMENTARIO: esta variable aquí fuera es un poco rara. Se pone a null cada vez que se renderiza el componente.
  // Huele a que algo no debería ser así. Yo creo que se puede eliminar de aquí y de la línea en win_turn/lose_turn.
  let cartaClick = null;
  
  // COMENTARIO: esta función aquí fuera me gusta más. Antes estaba dentro de la función que cambia el estado de
  // las cartas, cosa que no me cuadra demasiado.
  function sendCard(card) {
    const selectedCardMessage = JSON.stringify({ type: 'select_card', card, turn: currentTurn });
    websocketRef.current.send(selectedCardMessage);
  }

  // COMENTARIO: esta función aquí también hace que sea más comprensible handleCardClick.
  function updateCards(selectedCard) {
    setcartas(oldCartas => {
      const updatedCartas = oldCartas.filter((carta) => carta[0] !== selectedCard[0] || carta[1] !== selectedCard[1]);

      if (updatedCartas.length === 0) {
        return updatedCartas;
      }
      else {
        setCurrentTurn(currentTurn + 1);
        return updatedCartas;
      }
    });
  }

  // COMENTARIO: Sacando las funciones sendCard y updateCards fuera, esta función queda muchísimo más comprensible!
  const handleCardClick = (card) => {
    if (!clickedCard) {
        setClickedCard(card);
        cartaClick = card;  // COMENTARIO: Ya ves, yo creo que este cartaClick no se usa para nada.
        console.log("turno antes de mandar el mensaje", currentTurn);
        sendCard(card);
        updateCards(card);
    }
  };

  return (
    <div>
      {/* COMENTARIO: Este mensaje inicial se queda por ahí pululando. Deberíais renderizarlo solo si hay algo. */}
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
              // COMENTARIO: Muy bien en sacar este componente. Yo llamaría a la carpeta "Components" en vez de "Clases", pero bien!
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

