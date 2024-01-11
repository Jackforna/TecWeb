const bodyParser = require('body-parser');
const express = require('express');
const multer = require('multer');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
const app = express();
const needle = require('needle');
const port = 8080; // Puoi cambiare la porta se necessario
const dbUrl = 'mongodb://root:example@localhost:27017';
const client = new MongoClient(dbUrl);
const dbName = 'my-mongo-container';

/*Modificato per problemi di limiti*/ 
//Prima era app.use(bodyParser.json());
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

const token = process.env.TWITTER_BEARER_TOKEN; // Assicurati di impostare questa variabile d'ambiente (da ottenere)

app.get('/api/getTweet', async (req, res) => {
    const url = `https://api.twitter.com/2/tweets/search/recent?query=from:twitterdev`; // Esempio di URL per ottenere tweet recenti

    try {
        const response = await needle('get', url, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        res.status(200).json(response.body);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'data/db');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const uniqueFilename = uniqueSuffix + '-' + file.originalname;
    cb(null, uniqueFilename);
  }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), function (req, res) {
  const file = req.file;
  if (!file) {
    return res.status(400).send('Nessun file caricato.');
  }

  res.status(200).json({filePath: `/path/inside/container/${file.filename}` });
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

/*Temporanea per aggiunta di campi specifici user*/
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

      res.status(200).send('Utente aggiornato con successo');
  } catch (error) {
      console.error(error);
      res.status(500).send('Errore durante l\'aggiornamento dell\'utente');
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

//Aggiornamento single squeal
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

      if(updatedChannels.length>0)
      await ListChannelsCollection.insertMany(updatedChannels);
      
      const listChannels = await ListChannelsCollection.find().toArray();
    res.status(200).json(listChannels);
  } catch (error) {
      console.error(error);
      res.status(500).send('Errore durante l\'aggiornamento dei canali');
  }
});

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

    // Controlla se la collezione 'Users' esiste
    const collections3 = await db.listCollections({ name: 'Users' }).toArray();
    if (collections3.length === 0) {
        // La collezione 'Users' non esiste, quindi la crea
        const usersCollection = await db.createCollection('Users');
        console.log("Collezione 'Users' creata");

        // Elemento da inserire
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
            notifications: [false,false,false,false,false]
        };

        // Inserisci l'elemento nella collezione
        await usersCollection.insertOne(usersToInsert);
        console.log("Utente iniziale inserito nella collezione 'Users'");
    } else {
        /*await UsersCollection.deleteMany({});
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
          notifications: [false,false,false,false,false]
      };

      // Inserisci l'elemento nella collezione
      await UsersCollection.insertOne(usersToInsert);*/
        console.log("La collezione 'Users' esiste già");
        /* Delete option
        await UsersCollection.deleteMany({});
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
          char_d: 300,
          char_w: 2000,
          char_m: 7000,
          bio: "",
          photoprofileX: 0,
          photoprofileY: 0,
          notifications: [false,false,false,false,false]
        };
        
        await UsersCollection.insertOne(usersToInsert);
        */
    }

  } catch (err) {
      console.error(err);
  }
}

app.listen(port, () => {
  console.log(`Server in esecuzione su http://localhost:${port}`);
});