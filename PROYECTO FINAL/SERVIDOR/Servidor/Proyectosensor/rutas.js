const express = require('express');
const baseDatos = require('./controladores/basededatos');
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.json());



app.post('/hp', (req, res) => {
  if (req.protocol === 'https') {
    const httpUrl = 'http://' + req.get('host') + req.originalUrl;
    return res.redirect(httpUrl);
  } else {
    const humedad = req.body.humedad;
    console.log('Valor de humedad:', humedad);
    const connection = baseDatos.getConnection();

    const sql = 'INSERT INTO humedad (humedad, fecha, hora) VALUES (?, CURDATE(), CURTIME())';
    const values = [humedad];

    connection.query(sql, values, (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).send('Error al agregar la humedad');
      } else {
        res.send('Humedad agregada correctamente');
      }
    });
  }
});

app.get('/hve', (req, res) => {
  const connection = baseDatos.getConnection();

  const sql = 'SELECT * FROM encendido';

  connection.query(sql, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error al obtener las temperaturas');
    } else {
      res.json(results);
    }
  });
});

 app.get('/vc', (req, res) => {
  const connection = baseDatos.getConnection();

  connection.ping((error) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error al verificar la conexión a la base de datos');
    } else {
      res.send('La conexión a la base de datos está funcionando correctamente');
    }
  });
});

app.put('/ce', (req, res) => {
  const nuevoEstado = req.body.nuevoEstado;

  const connection = baseDatos.getConnection();

  const sql = 'UPDATE encendido SET encendido = ?';

  connection.query(sql, [nuevoEstado], (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error al actualizar el estado');
    } else {
      res.send('Estado actualizado correctamente');
    }
  });
});


app.get('/hg', (req, res) => {
  if (req.protocol === 'https') {
    const httpUrl = 'http://' + req.get('host') + req.originalUrl;
    return res.redirect(httpUrl);
  }

  const connection = baseDatos.getConnection();
  const sql = 'SELECT * FROM humedad';

  connection.query(sql, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error al obtener los datos de humedad');
    } else {
      res.json(results);
    }
  });
});

module.exports = app;
