import React from 'react';

const Card = ({ suit, number, onClick }) => {
  const [isSelected, setIsSelected] = React.useState(false);

  const handleClick = () => {
    setIsSelected(true);
    onClick({ suit, number });
  };

  return (
    <div className={`card ${isSelected ? 'selected' : ''}`} onClick={handleClick} style={{cursor: 'pointer'}}>
      <p>{number}</p>
      <p>{suit}</p>
    </div>
  );
};

export default Card;
