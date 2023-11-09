import React from 'react';
import './categoria.css';
import Movie from './pelicula.jsx';

function Category(props) {
  return (
    <div className="category">
      <h2>{props.categoryTitle}</h2>
      <div className="movie-list">
        {props.movies.map((movie) => (
          <Movie
            key={movie.id}
            nombre={movie.nombre}
            ano={movie.ano}
            actores={movie.actores}
          />
        ))}
      </div>
    </div>
  );
}

export default Category;


