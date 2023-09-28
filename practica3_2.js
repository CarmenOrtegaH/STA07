const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

// Middleware para parsear el cuerpo de las solicitudes en formato JSON
app.use(express.json());

// Ruta al archivo JSON que servirá como base de datos
const databaseFile = 'peliculas.json';

// Función para cargar la base de datos desde el archivo JSON
function loadDatabase() {
  try {
    const data = fs.readFileSync(databaseFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { actores: [], peliculas: [] };
  }
}

// Función para guardar la base de datos en el archivo JSON
function saveDatabase(database) {
  const data = JSON.stringify(database, null, 2);
  fs.writeFileSync(databaseFile, data);
}

// Endpoint para buscar una película por ID
app.get('/peliculas/:id', (req, res) => {
  const id = req.params.id;
  const database = loadDatabase();
  const movie = database.movies.find((m) => m.id === id);
  if (movie) {
    res.json(movie);
  } else {
    res.status(404).json({ error: 'Película no encontrada' });
  }
});

// Endpoint para crear una película
app.post('/peliculas', (req, res) => {
  const { id, nombre, anoPublicacion, actores } = req.body;
  const database = loadDatabase();
  const newMovie = { id, nombre, anoPublicacion, actores };
  database.movies.push(newMovie);
  saveDatabase(database);
  res.json(newMovie);
});

// Endpoint para borrar una película por ID
app.delete('/peliculas/:id', (req, res) => {
  const id = req.params.id;
  const database = loadDatabase();
  const index = database.movies.findIndex((m) => m.id === id);
  if (index !== -1) {
    database.movies.splice(index, 1);
    saveDatabase(database);
    res.json({ message: 'Película eliminada con éxito' });
  } else {
    res.status(404).json({ error: 'Película no encontrada' });
  }
});

// Endpoint para modificar una película por ID
app.put('/peliculas/:id', (req, res) => {
  const id = req.params.id;
  const { nombre, anoPublicacion, actores } = req.body;
  const database = loadDatabase();
  const movie = database.movies.find((m) => m.id === id);
  if (movie) {
    if (nombre) movie.nombre = nombre;
    if (anoPublicacion) movie.anoPublicacion = anoPublicacion;
    if (actores) movie.actores = actores;
    saveDatabase(database);
    res.json(movie);
  } else {
    res.status(404).json({ error: 'Película no encontrada' });
  }
});

// Más endpoints para acciones relacionadas con actores, como crear, borrar y modificar

app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});
