import React from 'react';
import './categoria.css'
import Movie from './pelicula.jsx';

function Category(props) {
  return (
    <div className="category">
      <h2>{props.categoryTitle}</h2>
      <div className="movie-list">
        {props.movies.map((movie) => (
          <Movie
            key={movie.id}
            title={movie.title}
            director={movie.director}
            year={movie.year}
          />
        ))}
      </div>
    </div>
  );
}

export default Category;
