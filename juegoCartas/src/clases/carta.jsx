import React from 'react';

function Carta({ palo, valor }) {
  return (
    <div className={`card ${palo}`}>
      <span className="value">{valor}</span>
    </div>
  );
}

export default Carta;
