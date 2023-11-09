import React, { useState } from 'react';
import './pelicula.css'

function Movie(props) {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="movie-card">
      <h2>{props.nombre}</h2>
      {showDetails ? (
        <div>
          <p>Actores: {props.actores}</p>
          <p>Año de lanzamiento: {props.ano}</p>
        </div>
      ) : null}
      <button onClick={toggleDetails}>
        {showDetails ? 'Menos información' : 'Más información'}
      </button>
    </div>
  );
}

export default Movie;
