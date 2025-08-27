const express = require('express');
const app = express();
const admin = require('firebase-admin');

// Usa la variable de entorno que creaste en Railway
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://servidor-b3f89-default-rtdb.firebaseio.com'
});

const db = admin.database();

// Ruta para que el jugador actualice su posición
app.get('/actualizar_jugador', (req, res) => {
  const { id, x, y } = req.query;

  if (!id || !x || !y) {
    return res.status(400).send('Faltan parámetros (id, x, y).');
  }

  db.ref(`jugadores/${id}`).update({
    x: parseFloat(x),
    y: parseFloat(y)
  }).then(() => {
    res.send('OK');
  }).catch(error => {
    res.status(500).send('Error: ' + error.message);
  });
});

// Envía los datos de todos los jugadores como texto simple
app.get('/obtener_jugadores', (req, res) => {
  db.ref('jugadores').once('value').then(snapshot => {
    let jugadores_data = [];
    snapshot.forEach(childSnapshot => {
      let id = childSnapshot.key;
      let pos_x = childSnapshot.val().x;
      let pos_y = childSnapshot.val().y;
      jugadores_data.push(`${id},${pos_x},${pos_y}`);
    });
    res.send(jugadores_data.join(';'));
  }).catch(error => {
    res.status(500).send('Error: ' + error.message);
  });
});

// Inicia el servidor
const listener = app.listen(process.env.PORT, () => {
  console.log('Servidor en el puerto ' + listener.address().port);
});
