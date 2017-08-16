const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.static('public'));

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Jet Mother**cking Fuel';
app.locals.folders = {
  1: 'Bookmarks',
}
app.locals.links = {
  1: 'best site evah!',
  shortURL: 'http://jetfuel.heroku/abc123',
  ogURL: 'http://frontend.turing.io/projects/jet-fuel.html',
  date: 'date',
  folder_id: 1,
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/api/v1/folders', (req, res) => {
  const allFolders = app.locals.folders;
  res.json(allFolders);
})

app.get('/api/v1/links', (req, res) => {
  const allLinks = app.locals.links;
  res.json(allLinks);
})

app.get('/api/v1/folders/:id', (req, res) => {
  const { id } = req.params;
  const title = app.locals.folders[id]

  if(!title) { return res.status(404).send('This folder has not been found') }

  res.json({ id, title })
});

app.get('/api/v1/folders/:id/links/:link_id', (req, res) => {
  const { id, link_id } = req.params;
  const { title, shortURL, ogURL, date } = app.locals.links
  const folder_id = app.locals.folders[link_id]

  if(!title) { return res.status(404).send('This link has not been found') }

  res.json({ title, shortURL, ogURL, date, folder_id })
});

app.post('/api/v1/folders', (req, res) => {
  const id = Date.now();
  const { title } = req.body;

  if(!title) { return res.status(422).send({ error: 'There is no title'} ) }

  app.locals.folders[id] = title;

  res.status(201).json({ id, title });
})

app.post('/api/v1/folders/:id/links', (req, res) => {
  const { id } = req.params;
  const link_id = Date.now();
  const { title, shortURL, ogURL, date, folder_id } = req.body;
  console.log(req.body);

  if(!title) { return res.status(422).send({ error: 'There is no title'} ) }

  app.locals.links[id] = title;
  app.locals.links[link_id] = folder_id;


  res.status(201).json({ link_id, title, shortURL, ogURL, date, folder_id });
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});
