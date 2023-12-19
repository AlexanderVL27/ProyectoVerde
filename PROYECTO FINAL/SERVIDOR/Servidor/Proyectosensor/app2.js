const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const baseDatos = require('./controladores/basededatos');
const rutas = require('./rutas');

const app = express();
app.use(bodyParser.json());

app.use(rutas);

const PORT = 3000; // Puerto 80 para HTTP

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});