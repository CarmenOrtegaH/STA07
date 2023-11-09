import React from 'react';
import Carta from './carta.jsx';

function Baraja() {
  const palos = ['corazones', 'picas', 'rubis', 'treboles'];
  const valores = ['1','2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  const cartas = [];

  for (const palo of palos) {
    for (const valor of valores) {
      cartas.push({ palo, valor });
    }
  }

  return (
    <div className="deck">
      {cartas.map((carta, index) => (
        <Carta key={index} palo={carta.palo} valor={carta.valor} />
      ))}
    </div>
  );
}

export default Baraja;
