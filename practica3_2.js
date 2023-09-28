const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

// Middleware para procesar el 
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
  const movie = database.peliculas.find((m) => m.id === id);
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
  database.peliculas.push(newMovie);
  saveDatabase(database);
  res.json(newMovie);
});

// Endpoint para borrar una película por ID
app.delete('/peliculas/:id', (req, res) => {
  const id = req.params.id;
  const database = loadDatabase();
  const index = database.peliculas.findIndex((m) => m.id === id);
  if (index !== -1) {
    database.peliculas.splice(index, 1);
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
  const movie = database.peliculas.find((m) => m.id === id);
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

// Endpoint para crear un actor
app.post('/actores', (req, res) => {
  const { idA, nombreCompleto, anoNacimiento } = req.body;
  const database = loadDatabase();
  const newActor = { idA, nombreCompleto, anoNacimiento };
  database.actores.push(newActor);
  saveDatabase(database);
  res.json(newMovie);
});

// Endpoint para borrar un actor por ID
app.delete('/actores/:id', (req, res) => {
  const id = req.params.id;
  const database = loadDatabase();
  const index = database.actores.findIndex((m) => m.id === id);
  if (index !== -1) {
    database.actores.splice(index, 1);
    saveDatabase(database);
    res.json({ message: 'Actor eliminado con éxito' });
  } else {
    res.status(404).json({ error: 'Actor no encontrado' });
  }
});

// Endpoint para modificar un actor por ID
app.put('/actores/:id', (req, res) => {
  const id = req.params.id;
  const { nombreCompleto, anoNacimiento} = req.body;
  const database = loadDatabase();
  const actor = database.actores.find((m) => m.id === id);
  if (actor) {
    if (nombre) actor.nombreCompleto = nombreCompleto;
    if (anoPublicacion) actor.anoNacimiento = anoNacimiento;
    saveDatabase(database);
    res.json(actor);
  } else {
    res.status(404).json({ error: 'Película no encontrada' });
  }
});

app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});
