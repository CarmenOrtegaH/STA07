import React from 'react'
import './App.css'
import Titulo from './js/titulo.jsx'
import Category from './js/categoria.jsx'

function App() {
  const moviesData = [
    { id: 1, title: 'The Godfather', director: 'Francis Ford Coppola', year: 1972 },
    { id: 2, title: 'The Shawshank Redemption', director: 'Frank Darabont', year: 1994 },
    { id: 3, title: 'The Warriors', director: 'Walter Hill', year: 1979 },
    { id: 4, title: 'Enter the Dragon', director: 'Robert Clouse', year: 1973 },
    { id: 5, title: 'Escape From New York’', director: 'John Carpenter', year: 1997 },
    { id: 6, title: 'Lethal Weapon’', director: 'Richard Donner', year: 1987 },
    { id: 7, title: 'Die Hard’', director: 'John McTiernan ', year: 1987 },
    { id: 8, title: 'Ocho Apellidos Vascos', director: 'Emilio Martínez-Lázaro', year: 2014 },
    { id: 9, title: 'Bienvenidos al Sur', director: 'Luca Miniero', year: 2010 },
    { id: 10, title: 'Volver', director: 'Pedro Almodóvar', year: 2006 },
    { id: 11, title: 'Torrente, el brazo tonto de la ley', director: 'Santiago Segura', year: 1998 },
    { id: 12, title: 'Superbad', director: 'Greg Mottola', year: 2007 },
    { id: 13, title: 'Anchorman: The Legend of Ron Burgundy', director: 'Adam McKay', year: 2004 },
    { id: 14, title: 'The Grand Budapest Hotel', director: 'Wes Anderson', year: 2014 },
    { id: 15, title: 'Dumb and Dumber', director: 'Peter Farrelly y Bobby Farrelly', year: 1994 },
    { id: 16, title: 'Forrest Gump', director: 'Robert Zemeckis', year: 1994 },
    { id: 17, title: 'Schindler’s List', director: 'Steven Spielberg', year: 1993 },
    { id: 18, title: 'A Beautiful Mind', director: 'Ron Howard', year: 2001 },
    { id: 19, title: 'The Green Mile', director: 'Frank Darabont', year: 1999 }
  ]

  const categoriesData = [
    {
      id: 1,
      name: 'Acción',
      moviesData: [3, 4, 5, 6, 7],
    },
    {
      id: 2,
      name: 'Comedia',
      moviesData: [8, 9, 10, 11, 12, 13, 14, 15],
    },
    {
      id: 3,
      name: 'Drama',
      moviesData: [1, 16, 2, 17, 18, 19],
    },
  ]

  return (
    <div className="App">
      <Titulo />

      {categoriesData.map((category) => (
        <Category
          key={category.id}
          categoryTitle={category.name}
          movies={category.moviesData.map((id) => moviesData.find((movie) => movie.id === id))}
        />
      ))}
    </div>
  )
}

export default App

