const express = require('express');
const app = express();
const admin = require('firebase-admin');

// Usa la variable de entorno que crearás en Railway
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://servidor-b3f89-default-rtdb.firebaseio.com'
});

const db = admin.database();

// Ruta para actualizar la posición del jugador
app.get('/actualizar_jugador', (req, res) => {
  const { id, x, y } = req.query;

  if (!id || !x || !y) {
    return res.status(400).send('Faltan parámetros.');
  }

  db.ref('jugadores/' + id).update({
    x: parseFloat(x),
    y: parseFloat(y)
  }).then(() => {
    res.send('OK');
  }).catch(error => {
    res.status(500).send('Error: ' + error.message);
  });
});

// Ruta para obtener la posición de todos los jugadores
app.get('/obtener_jugadores', (req, res) => {
  db.ref('jugadores').once('value').then(snapshot => {
    res.json(snapshot.val());
  }).catch(error => {
    res.status(500).send('Error: ' + error.message);
  });
});

// Inicia el servidor
const listener = app.listen(process.env.PORT, () => {
  console.log('Servidor en el puerto ' + listener.address().port);
});
