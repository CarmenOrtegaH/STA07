import React from 'react';
import Carta from './carta.jsx';

function Player({ name, cartas }) {
  return (
    <div className="player">
      <h3>{name}</h3>
      <div className="hand">
        {cartas.map((carta, index) => (
          <Carta key={index} palo={carta.palo} valor={carta.valor} />
        ))}
      </div>
    </div>
  );
}

export default Player;
