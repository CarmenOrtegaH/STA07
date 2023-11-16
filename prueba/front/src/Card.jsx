// Card.js
import React from 'react';

const Card = ({ suit, number }) => {
  return (
    <div className="card">
      <p>{number}</p>
      <p>{suit}</p>
    </div>
  );
};

export default Card;
