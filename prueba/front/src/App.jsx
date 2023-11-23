// App.js
import React from 'react';
import Card from './Card.jsx';
import './App.css';

const App = () => {
  const cards = [
    { suit: 'Hearts', number: '1' },
    { suit: 'Diamonds', number: '2' },
    { suit: 'Spades', number: '3' },
    { suit: 'Clubs', number: '4' },
    { suit: 'Hearts', number: '5' },
    { suit: 'Spades', number: '6' },
    { suit: 'Diamonds', number: '7' },
  ];

  return (
    <div className="app">
      <div className="player-hand">
        {cartas.map((card, index) => (
          <Card key={index} suit={card[0]} number={card[1]} />
        ))}
      </div>
    </div>
  );
};

export default App;

