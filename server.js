const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Jet Mother**cking Fuel';

const requireHTTPS = (req, res, next) => {
  if(req.headers.host === 'localhost:3000' || '127.0.0.1') {
    return next()
  }
    if (!req.headers['x-forwarded-proto']) {
      return res.redirect(`https://${req.headers('host')}${req.url}`)
    };
    next()
  }

app.use(requireHTTPS)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'));


const base58 = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
const base = base58.length;

const encode = (id) => {
  let encoded = '';
  while (id) {
    let remainder = id % base;
    id = Math.floor(id / base);
    encoded = base58[remainder].toString() + encoded;
  }
  return encoded;
}

const decode = (string) => {
  let decoded = 0;
  while(string) {
    let index = base58.indexOf(string[0]);
    let power = string.length - 1;
    decoded += index * (Math.pow(base, power));
    string = string.substring(1);
  }
  return decoded;
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/api/v1/folders', (req, res) => {
  database('folders').select()
    .then(folders => res.status(200).json(folders))
    .catch(error => res.status(500).json({ error }));
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
  database('folders').insert(newFolder, '*')
  .then(folder => res.status(201).json(folder))
  .catch(error => res.status(500).json({ error }))
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
      return res.status(200).json({ folder });
    })
    .catch(error => res.status(500).json({ error }));
});

app.get('/api/v1/links', (req, res) => {
  database('links').select()
    .then(links => res.status(200).json(links))
    .catch(error => res.status(500).json({ error }));
});

app.post('/api/v1/links', (req, res) => {
  const newLink = req.body;

  for (let requiredParameter of ['description', 'ogURL', 'folder_id']) {
    if (!newLink[requiredParameter]) {
      return res.status(422).json({
        error: `Missing required parameter ${requiredParameter}.`
      })
    }
  }
  database('links').insert(newLink, '*')
    .then(link => {
      let shortURL = `tiny/${encode(link[0].id)}`
      Object.assign(link[0], { shortURL })
      return res.status(201).json(link)
    })
})

app.get('/api/v1/folders/:id/links/', (req, res) => {
  const { id } = req.params;

  database('links').where({'folder_id': id }).select()
    .then(links => res.status(200).json(links))
    .catch(error => res.status(500).json({ error }))
});

app.route('/api/v1/links/:id')
  .get((req, res) => {
    let { id } = req.params;
    id = decode(id)
    database('links').where({ id }).select()
      .then(link => res.status(302).redirect(link[0].ogURL))
      .catch(error => res.status(404).json({ error }))
  })

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});

module.exports = app;
