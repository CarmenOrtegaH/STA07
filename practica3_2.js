const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

// Middleware para procesar el CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.json());

// Ruta al archivo JSON que servirá como base de datos
const databaseFile = 'peliculas.json';

// Función para cargar la base de datos desde el archivo JSON
function loadDatabase() {
  try {
    const data = fs.readFileSync(databaseFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { actores: [], peliculas: [], categorias: [] };
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
    movie.actores = movie.actores.map((actorId) => {
      const actor = database.actores.find((a) => a.idA === actorId);
      return actor ? actor.nombreCompleto : actorId;
    });
    res.json(movie);
  } else {
    res.status(404).json({ error: 'Película no encontrada' });
  }
});

// Endpoint para buscar todas las películas
app.get('/peliculas', (req, res) => {
  const database = loadDatabase();
  const peliculas = database.peliculas;

  // Mapea las películas y agrega información de actores
  const peliculasConActores = peliculas.map((pelicula) => {
    const actoresConNombre = pelicula.actores.map((actorId) => {
      const actor = database.actores.find((a) => a.idA === actorId);
      return actor ? actor.nombreCompleto : actorId;
    });

    return { ...pelicula, actores: actoresConNombre };
  });

  res.json(peliculasConActores);
});

// Endpoint para buscar todas las categorías
app.get('/categorias', (req, res) => {
  const database = loadDatabase();
  const categorias = database.categorias;

  res.json(categorias);
});

// Endpoint para crear una película
app.post('/peliculas', (req, res) => {
  const { id, nombre, ano, actores } = req.body;
  const database = loadDatabase();
  const newMovie = { id, nombre, ano, actores };
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
  const { nombre, ano, actores } = req.body;
  const database = loadDatabase();
  const movie = database.peliculas.find((m) => m.id === id);
  if (movie) {
    if (nombre) movie.nombre = nombre;
    if (ano) movie.ano = ano;
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
  res.json(newActor);
});

// Endpoint para borrar un actor por ID
app.delete('/actores/:id', (req, res) => {
  const id = req.params.id;
  const database = loadDatabase();
  const index = database.actores.findIndex((a) => a.idA === id);
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
  const { nombreCompleto, anoNacimiento } = req.body;
  const database = loadDatabase();
  const actor = database.actores.find((a) => a.idA === id);
  if (actor) {
    if (nombreCompleto) actor.nombreCompleto = nombreCompleto;
    if (anoNacimiento) actor.anoNacimiento = anoNacimiento;
    saveDatabase(database);
    res.json(actor);
  } else {
    res.status(404).json({ error: 'Actor no encontrado' });
  }
});

app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});
