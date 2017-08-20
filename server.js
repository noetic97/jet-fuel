const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'));

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Jet Mother**cking Fuel';

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/api/v1/folders', (req, res) => {
  database('folders').select()
    .then(folders => {
      res.status(200).json(folders)
    })
    .catch(err => {
      res.status(500).json({ err })
    });
});

app.post('/api/v1/folders', (req, res) => {
  const newFolder = req.body;
  for (let requiredParameter of ['title']) {
    if (!newFolder[requiredParameter]) {
      return res.status(422).json({
        error: `Missing required parameter ${requiredParameter}.`
      })
    }
  }
  database('folders').insert(newFolder, 'id')
    .then(folder => {
      res.status(201).json(newFolder)
    })
    .catch(err => {
      res.status(500).json({ err });
    });
});

app.get('/api/v1/folders/:id', (req, res) => {
  const { id } = req.params;

  database('folders').where({ id }).select()
    .then(folder => {
      if (!folder.length) {
        return res.status(404).json({
          error: `Could not find a folder with an id of ${id}`
        });
      }
      res.status(200).json({ folder });
    })
    .catch(err => res.status(500).json({ err }));
});

app.get('/api/v1/links', (req, res) => {
  database('links').select()
    .then(links => {
      res.status(200).json(links)
    })
    .catch(err => {
      res.status(500).json({ err })
    });
});

app.post('/api/v1/links', (req, res) => {
  const { id } = req.params;
  const newLink = req.body;

  for (let requiredParameter of ['description', 'ogURL', 'folder_id']) {
    if (!newLink[requiredParameter]) {
      return res.status(422).json({
        error: `Missing required parameter ${requiredParameter}.`
      })
    }
  }
  database('links').insert(newLink, 'id')
    .then(link => {
      res.status(201).json(newLink)
    })
})

app.get('/api/v1/folders/:id/links/', (req, res) => {
  const { id } = req.params;

  database('links').where({'folder_id': id }).select()
    .then(links => {
      res.status(200).json(links);
    })
    .catch(error => {
      res.status(500).json({ error });
    })
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});

module.exports = app;
