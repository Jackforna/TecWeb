const express = require('express');
const app = express();
const port = 8080; // Puoi cambiare la porta se necessario

app.use(express.static('public')); // 'public' è la cartella dove metterai i tuoi file HTML, CSS, JS, ecc.

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/accesso.html'); // Assicurati che il file 'accesso.html' sia nella cartella 'public'
});

app.listen(port, () => {
  console.log(`Server in esecuzione su http://localhost:${port}`);
});