import React, { useState, useEffect } from 'react';
import './App.css';
import Titulo from './js/titulo.jsx';
import Category from './js/categoria.jsx';

function App() {
  const [moviesData, setMoviesData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);

  useEffect(() => {
    // Cargar datos de películas
    fetch('http://localhost:3000/peliculas')
      .then((response) => response.json())
      .then((data) => {
        setMoviesData(data); 
        console.log(moviesData);
      })
      .catch((error) => console.error('Error al cargar datos de películas:', error));

    // Cargar datos de categorías
    fetch('http://localhost:3000/categorias')
      .then((response) => response.json())
      .then((data) => {
        setCategoriesData(data);
      })
      .catch((error) => console.error('Error al cargar datos de categorías:', error));
  }, []);
  
  return (
    <div className="App">
      
      <Titulo />

      {categoriesData.map((category) => (
        <Category
          key={category.id}
          categoryTitle={category.name}
          movies={category.moviesData.map(
            (id) => moviesData.find((movie) => movie.id === id)
          )}
        />
      ))}
    </div>
  );

}

export default App;
