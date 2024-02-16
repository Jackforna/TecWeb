const bodyParser = require('body-parser');
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
const app = express();
const needle = require('needle');
const port = 8080; // Puoi cambiare la porta se necessario
const dbUrl = 'mongodb://root:example@localhost:27017';
const client = new MongoClient(dbUrl);
const dbName = 'my-mongo-container';
const multer = require('multer');
const schedule = require('node-schedule');


app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/squealer-app', express.static(path.join(__dirname, 'my-react-app/build')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'accesso.html'));
});

/*Angular main page access*/
const angularDistPath = path.join(__dirname, 'SMM-angular/dist/smm-squealer');
app.use('/SMM', express.static(angularDistPath));
app.get('/SMM/*', (req, res) => {
    res.sendFile(path.join(angularDistPath, 'index.html'));
});


app.get('/moderator', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'moderator.html'));
});

app.get('/squealer-app/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'my-react-app/build', 'index.html'));
});

if (!client.connect()) {
  console.error('Errore nella connessione a MongoDB:', err);
  process.exit(1);
} else {
  console.log("Connesso correttamente al server MongoDB");
}

/*
let twitterBearerToken = '';

const apiKey = 'hCMnmtucaW9FmfLBMrmXA8UW0';
const apiSecretKey = 'nxnRxQblR3JDUb05dxDq83EozNn4wUG1lK1smBXPcVlcUcKOCS';
const tokenURL = 'https://api.twitter.com/oauth2/token';

const credentials = `${apiKey}:${apiSecretKey}`;
const credentialsBase64Encoded = Buffer.from(credentials).toString('base64');

const options = {
  headers: {
    'Authorization': `Basic ${credentialsBase64Encoded}`,
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  },
  body: 'grant_type=client_credentials'
};

needle.post(tokenURL, options.body, { headers: options.headers }, (error, response) => {
  if (!error && response.statusCode === 200) {
    // Qui hai il tuo token di accesso
    twitterBearerToken = response.body.access_token; // Salva il token nella variabile globale
    console.log('Bearer Token:', twitterBearerToken);
  } else {
    console.error('Errore ottenendo il Bearer Token:', error);
  }
});

app.get('/api/getTweet', async (req, res) => {
    const url = `https://api.twitter.com/2/tweets/search/recent?query=from:twitterdev`; // Esempio di URL per ottenere tweet recenti

    if (!twitterBearerToken) {
      return res.status(500).json({ error: 'Bearer Token non disponibile' });
    }

    try {
        const response = await needle('get', url, {
            headers: {
                "Authorization": `Bearer ${twitterBearerToken}`//aggiungere token
            }
        });
        if (response.statusCode === 200 && response.body.data && response.body.data.length > 0) {
          // Seleziona un tweet casuale dai risultati
          const randomTweet = response.body.data[Math.floor(Math.random() * response.body.data.length)];
          res.status(200).json(randomTweet);
        } else {
          console.log('Nessun tweet trovato o errore nella risposta API', response.body);
            res.status(500).json({ error: 'Nessun tweet trovato o errore nella risposta API' });
        }
    } catch (error) {
      console.error('Errore nella richiesta API:', error);
        res.status(500).json({ error: error.message });
    }
});
*/

const Twit = require('twit');

// Configura Twit con le tue chiavi di accesso di Twitter
const T = new Twit({
  consumer_key: 'hCMnmtucaW9FmfLBMrmXA8UW0',
  consumer_secret: 'nxnRxQblR3JDUb05dxDq83EozNn4wUG1lK1smBXPcVlcUcKOCS',
  access_token: '1758439085474000896-PDwNVX2tkHkwTtGvJuAKulgKDCE00s',
  access_token_secret: 'P33xoej1BqEyY6JmME4MBzf4ECLtmlNLc8dGkJmwsiiIE',
  timeout_ms: 60 * 1000,
  strictSSL: true,
});

// Endpoint per ottenere tweet casuali
app.get('/api/random-tweet', async (req, res) => {
  try {
    const result = await T.get('search/tweets', { q: 'from:twitter', count: 100 });
    const randomIndex = Math.floor(Math.random() * result.data.statuses.length);
    const randomTweet = result.data.statuses[randomIndex];
    res.status(200).json(randomTweet);
  } catch (error) {
    console.error('Error fetching tweet:', error);
    res.status(500).json({ error: error.message });
  }
});


initializeCollections();

  const db = client.db(dbName);  
  const UsersCollection = db.collection('Users');
  const ListChannelsCollection = db.collection('ListChannels');
  const ListSquealsCollection = db.collection('ListSqueals');

app.get('/get-users', async (req, res) => {
  try {
    const users = await UsersCollection.find().toArray();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send('Errore durante la lettura dei dati degli utenti');
  }
});

app.get('/get-user/:id', async (req, res) => {
  try {
      const id = req.params.id;
      let object;
      if(id!="1"){
        object = await UsersCollection.findOne({ _id: new ObjectId(id) });
        if (!object) {
            return res.status(404).send('Oggetto non trovato');
        }
      }
      res.status(200).json(object);
  } catch (error) {
      console.error(error);
      res.status(500).send('Errore durante la ricerca dell\'oggetto');
  }
});

app.post('/add-user', async (req, res) => {
  try {
      const result = await UsersCollection.insertOne(req.body);
      res.status(201).json(result);
  } catch (error) {
      console.error(error);
      res.status(500).send('Errore durante l\'aggiunta del nuovo utente');
  }
});

app.put('/update-users', async (req, res) => {
  try {
    const updatedUsers = req.body;
    const operations = updatedUsers.map(user => {
      const _id = typeof user._id === 'string' ? new ObjectId(user._id) : user._id;

      const { _id: idToRemove, ...replacementData } = user;

      if (Array.isArray(replacementData.notifications) && replacementData.notifications.length && Array.isArray(replacementData.notifications[0])) {
        replacementData.notifications = replacementData.notifications[0];
      }

      return {
        replaceOne: {
          filter: { _id: _id },
          replacement: replacementData, // Non include l'`_id` nel documento di sostituzione
          upsert: true // Crea un nuovo documento se nessuno corrisponde al filtro
        }
      };
    });
    await UsersCollection.bulkWrite(operations);
      const users = await UsersCollection.find().toArray();
      res.status(200).json(users);
  } catch (error) {
      console.error(error);
      res.status(500).send('Errore durante l\'aggiornamento degli utenti');
  }
});

app.delete('/delete-user/:id', async (req, res) => {
  try {
    const idToDelete = req.params.id; // Ottieni l'ID dall'URL
    if (!ObjectId.isValid(idToDelete)) {
      return res.status(400).send('ID non valido');
    }
    await UsersCollection.deleteOne({ _id: new ObjectId(idToDelete) });
      
      const listUsers = await UsersCollection.find().toArray();
    res.status(200).json(listUsers);
  } catch (error) {
    res.status(500).send('Errore durante la lettura dei dati della lista dei messaggi');
  }
});

app.put('/update-user/:id', async (req, res) => {
  try {
      const id = req.params.id;
      const updates = req.body;

      const result = await UsersCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updates }
      );

      if (result.modifiedCount === 0) {
          return res.status(404).send('Utente non trovato o nessun aggiornamento necessario');
      }

      res.status(200).json({ message: 'Utente aggiornato con successo' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Errore durante l\'aggiornamento dell\'utente' });
  }
});

app.get('/get-listSqueals', async (req, res) => {
  try {
    const listSqueals = await ListSquealsCollection.find().toArray();
    res.status(200).json(listSqueals);
  } catch (error) {
    res.status(500).send('Errore durante la lettura dei dati della lista dei messaggi');
  }
});


app.post('/add-squeal', async (req, res) => {
  try {
      await ListSquealsCollection.insertOne(req.body);
      const result = await ListSquealsCollection.find().toArray();
      res.status(201).json(result);
  } catch (error) {
      console.error(error);
      res.status(500).send('Errore durante l\'aggiunta del nuovo squeal');
  }
});

app.put('/update-squeals', async (req, res) => {
  try {
      const updatedSqueals = req.body;

      updatedSqueals.forEach((squeal) => {
        delete squeal._id;
      });

      await ListSquealsCollection.deleteMany({});

      if(updatedSqueals.length!=0)
        await ListSquealsCollection.insertMany(updatedSqueals);
      
      const listSqueals = await ListSquealsCollection.find().toArray();
    res.status(200).json(listSqueals);
  } catch (error) {
      console.error(error);
      res.status(500).send('Errore durante l\'aggiornamento degli squeals');
  }
});

app.delete('/delete-all-squeals', async (req, res) => {
  try {
    await ListSquealsCollection.deleteMany({});
    res.status(200).send('Tutti gli Squeals sono stati cancellati');
  } catch (error) {
    res.status(500).send('Errore durante la cancellazione di tutti gli Squeals');
  }
});

app.put('/update-squeal/:id', async (req, res) => {
  try {
      const id = req.params.id;
      const updates = req.body;

      const result = await ListSquealsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updates }
      );

      if (result.modifiedCount === 0) {
          return res.status(404).send('Squeal non trovato o nessun aggiornamento necessario');
      }

      res.status(200).send('Squeal aggiornato con successo');
  } catch (error) {
      console.error(error);
      res.status(500).send('Errore durante l\'aggiornamento dello Squeal');
  }
});


app.get('/get-listChannels', async (req, res) => {
  try {
    const listChannels = await ListChannelsCollection.find().toArray();
    res.status(200).json(listChannels);
  } catch (error) {
    res.status(500).send('Errore durante la lettura dei dati della lista dei canali');
  }
});

app.post('/add-channel', async (req, res) => {
  try {
      await ListChannelsCollection.insertOne(req.body);
      const result = await ListChannelsCollection.find().toArray();
      res.status(201).json(result);
  } catch (error) {
      console.error(error);
      res.status(500).send('Errore durante l\'aggiunta del nuovo canale');
  }
});

app.put('/update-channels', async (req, res) => {
  try {
      const updatedChannels = req.body;

      await ListChannelsCollection.deleteMany({});

      updatedChannels.forEach((channel) => {
        delete channel._id;
      });

      if(updatedChannels.length>0)
      await ListChannelsCollection.insertMany(updatedChannels);
      
      const listChannels = await ListChannelsCollection.find().toArray();
    res.status(200).json(listChannels);
  } catch (error) {
      console.error(error);
      res.status(500).send('Errore durante l\'aggiornamento dei canali');
  }
});


app.put('/update-channel/:id', async (req, res) => {
  try {
      const id = req.params.id;
      const updates = req.body;

      const objectId = new ObjectId(id);

      const result = await ListChannelsCollection.updateOne(
        { _id: objectId },
        { $push: { list_posts: updates.postToAdd } } // Esempio: { postToAdd: { ...dati del post... } }
    );

    if (result.modifiedCount === 0) {
      console.log(`Canale non trovato con ID: ${id}`);
      return res.status(404).send('Canale non trovato o nessun aggiornamento necessario');
  }
  
  

      res.status(200).json({ message: 'Canale aggiornato con successo' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Errore durante l\'aggiornamento del canale' });
  }
});

/*
app.put('/update-channel/:id', async (req, res) => {
  try {
      const id = req.params.id;

      // Verifica se l'ID è valido per ObjectId
      if (!ObjectId.isValid(id)) {
          return res.status(400).send('ID non valido');
      }

      const updates = req.body;
      console.log(`Tentativo di aggiornamento per il canale con ID: ${id}`, updates);

      // Verifica preliminare per vedere se il canale esiste
      const channelExists = await ListChannelsCollection.findOne({ _id: new ObjectId(id) });
      if (!channelExists) {
          console.log(`Canale non trovato con ID: ${id}`);
          return res.status(404).send('Canale non trovato');
      }

      // Procedi con l'aggiornamento
      const result = await ListChannelsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $push: { list_posts: updates.postToAdd } }
      );

      console.log(`Documenti corrispondenti: ${result.matchedCount}, Documenti aggiornati: ${result.modifiedCount}`);

      if (result.modifiedCount === 0) {
          return res.status(404).send('Nessun aggiornamento necessario o canale non trovato');
      }

      res.status(200).json({ message: 'Canale aggiornato con successo' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Errore durante l\'aggiornamento del canale' });
  }
});
*/

async function initializeCollections() {
  try {
    await client.connect();

    const db = client.db(dbName);

    const collections1 = await db.listCollections({ name: 'ListChannels' }).toArray();
    if (collections1.length === 0) {
      const listChannelsCollection = await db.createCollection('ListChannels');
      console.log("Collezione 'ListChannels' creata");
    } else {
      console.log("La collezione 'ListChannels' esiste già");
    }

    const collections2 = await db.listCollections({ name: 'ListSqueals' }).toArray();
    if (collections2.length === 0) {
      const listSquealsCollection = await db.createCollection('ListSqueals');
      console.log("Collezione 'ListSqueals' creata");
    } else {
      console.log("La collezione 'ListSqueals' esiste già");
    }

    const collections3 = await db.listCollections({ name: 'Users' }).toArray();
    if (collections3.length === 0) {
        const usersCollection = await db.createCollection('Users');
        console.log("Collezione 'Users' creata");

        const usersToInsert = {
            nickname: "Jack",
            photoprofile: "",
            fullname: "Giacomo Fornaciari",
            email: "giacomo.fornaciari@studio.unibo.it",
            cell: "3333122042",      
            password: "Fenice13!",
            version: "moderator",
            blocked: false,
            popularity: 0,
            clients:[],
            char_d: 300,
            char_w: 2000,
            char_m: 7000,
            bio: "",
            photoprofileX: 0,
            photoprofileY: 0,
            notifications: [false,false,false,false]
        };

        // Inserisci l'elemento nella collezione
        await usersCollection.insertOne(usersToInsert);
        console.log("Utente iniziale inserito nella collezione 'Users'");
    } else {
        console.log("La collezione 'Users' esiste già");
    }

  } catch (err) {
      console.error(err);
  }
}

schedule.scheduleJob('0 0 * * *', async () => {
  const usersArray = await UsersCollection.find({}).toArray();
  for (let i=0; i<usersArray.length; i++){
    switch(usersArray[i].version){
      case 'moderator':
        usersArray[i].char_d = 1000;
      break;
      case 'normal':
        usersArray[i].char_d = 300;
      break;
      case 'verified':
        usersArray[i].char_d = 600;
      break;
      case 'professional':
        usersArray[i].char_d = 1000;
      break;
      case 'SMM':
        usersArray[i].char_d = 0;
      break;
    }
  }
  UsersCollection.deleteMany({});
  await UsersCollection.insertMany(usersArray);
});

schedule.scheduleJob('0 0 * * 1', async () => {
  const usersArray = await UsersCollection.find({}).toArray();
  for (let i=0; i<usersArray.length; i++){
    switch(usersArray[i].version){
      case 'moderator':
        usersArray[i].char_w = 6500;
      break;
      case 'normal':
        usersArray[i].char_w = 2000;
      break;
      case 'verified':
        usersArray[i].char_w = 4000;
      break;
      case 'professional':
        usersArray[i].char_w = 6500;
      break;
      case 'SMM':
        usersArray[i].char_w = 0;
      break;
    }
  }
  UsersCollection.deleteMany({});
  await UsersCollection.insertMany(usersArray);
});

schedule.scheduleJob('0 0 1 * *', async () => {
  const usersArray = await UsersCollection.find({}).toArray();
  for (let i=0; i<usersArray.length; i++){
    switch(usersArray[i].version){
      case 'moderator':
        usersArray[i].char_m = 23000;
      break;
      case 'normal':
        usersArray[i].char_m = 7000;
      break;
      case 'verified':
        usersArray[i].char_m = 14000;
      break;
      case 'professional':
        usersArray[i].char_m = 23000;
      break;
      case 'SMM':
        usersArray[i].char_m = 0;
      break;
    }
  }
  UsersCollection.deleteMany({});
  await UsersCollection.insertMany(usersArray);
});

app.listen(port, () => {
  console.log(`Server in esecuzione su http://localhost:${port}`);
});