// This brings in access to the express node module.
const express = require('express');
// This assigns the express module into a variable to be used throughout the server file.
const app = express();
// this brings in the body-parser middleware node module.
const bodyParser = require('body-parser');

// this line sets the environment to production or development
const environment = process.env.NODE_ENV || 'development';
// the configuration calls the knexfile and passes the environment to it to determine which database, migrations, seeds to use.
const configuration = require('./knexfile')[environment];
// this line assigns the database to a variable so we can use it in the server to write to the current database.
const database = require('knex')(configuration);

// this makes sure that each request passes in the bodyparser middleware
app.use(bodyParser.json());
/* this makes sure that each request uses the urlencoded method of the bodyparser middleware.  The urlencoded method, when extended true,  pulls in another library called qs which is a parsing and stringifying library.  */
app.use(bodyParser.urlencoded({ extended: true }))
// express.static is used to determine where your static assets live and gets them.
app.use(express.static('public'));

// this line sets the port as what is passed in through the process.env.PORT in production or local host if their is no process port defined.
app.set('port', process.env.PORT || 3000);
//this just sets a string to be able to be retrieved locally.
app.locals.title = 'Jet Mother**cking Fuel';

// this initial request fetches the payload at the root directory.
app.get('/', (req, res) => {
  // this sendfile method on the response gives back the html file to load
  res.sendFile(__dirname + '/index.html');
});

// this endpoint will fetch a GET request at the passed in directory
app.get('/api/v1/folders', (req, res) => {
  // chooses which database table to query and returns a promise
  database('folders').select()
    // consumes the promise and returns a ststus and the data in the database as json object
    .then(folders => {
      res.status(200).json(folders)
    })
    // if there is a server error, this catch will return a status and err json object
    .catch(err => {
      res.status(500).json({ err })
    });
});

// this endpoint will fetch a POST request at the passed in directory
app.post('/api/v1/folders', (req, res) => {
  //this assigns a variable to the body passed in through the post method
  const newFolder = req.body;
  // for-of loop that determines if the body has all of the required data to run a successful post.
  for (let requiredParameter of ['title']) {
    // conditional that runs if the post body does not have the required data. This returns a 422 status and an error message that defines what is missing
    if (!newFolder[requiredParameter]) {
      return res.status(422).json({
        error: `Missing required parameter ${requiredParameter}.`
      })
    }
  }

  // if the required params are present, query the database and add the newBody.  returns a promise and the 'id' of the post
  database('folders').insert(newFolder, 'id')
  // consumes the promise and returns a status and the data in the database as json object
    .then(folder => {
      res.status(201).json(newFolder)
    })
    // if there is a server error, this catch will return a status and err json object
    .catch(err => {
      res.status(500).json({ err });
    });
});

// this endpoint will fetch a GET request at the passed in directory and return a single folder that has an id matching the url request params
app.get('/api/v1/folders/:id', (req, res) => {
  // assigns id variable to be used in a database query
  const { id } = req.params;
  /* queries the 'folders' database uses the .where to find if a record has an id that matches the req.params.  It selects that record and returns a promise*/
  database('folders').where({ id }).select()
  // consumes promise and checks if the query returna record with data or not
    .then(folder => {
      //if not, then the promiseresolves and returns a 404 status and error message
      if (!folder.length) {
        return res.status(404).json({
          error: `Could not find a folder with an id of ${id}`
        });
      }
      //if there is data in the record, promise resolves and returns a 200 status and the entire record
      res.status(200).json({ folder });
    })
    //catch to return 500 status and error
    .catch(err => res.status(500).json({ err }));
});

// endpoint that deletes a given record that has a matching id to the request params
app.delete('/api/v1/folders/:id', (req, res) => {
  //assigns the request params to a variable id
  const { id } = req.params;
  // queries the 'folders' database and finds a record where the record id matches the params id, then deletes that record, does not return a promise.
  database('folders').where({ id }).del()
    .then(res => {
      return res.status(200)
      .json({ deleted: `The folder with id ${id} was successfully deleted.`})
    })
    .catch(err => res.status(404).json({ err: `The folder with id ${id} was not found` }));
});

// this endpoint will fetch a GET request at the passed in directory
app.get('/api/v1/links', (req, res) => {
  // queries the 'links' database and selects all records, returns a promise
  database('links').select()
    // resolves the promise and returns a 200 status and all link data
    .then(links => res.status(200).json(links))
    //catch to return 500 status and error
    .catch(err => res.status(500).json({ err }));
});

// this endpoint will fetch a POST request at the passed in directory
app.post('/api/v1/links', (req, res) => {
  //assigns the body of the request to variable
  const newLink = req.body;
  // for-of loop that determines if the body has all of the required data to run a successful post.
  for (let requiredParameter of ['description', 'ogURL', 'folder_id']) {
    // conditional that runs if the post body does not have the required data. This returns a 422 status and an error message that defines what is missing
    if (!newLink[requiredParameter]) {
      return res.status(422).json({
        error: `Missing required parameter ${requiredParameter}.`
      })
    }
  }
  // if the required params are present, query the database and add the newLink.  returns a promise and the 'id' of the post
  database('links').insert(newLink, 'id')
    // consumes the promise and returns a 201 status and the data in the database as json object
    .then(link => res.status(201).json(newLink))
    //catch to return 500 status and error
    .catch(err => res.status(500).json({ error }))
});

app.delete('/api/v1/links/:id', (req, res) => {
  const { id } = req.params;

  database('links').where({ id }).del()
  .then(res => res.status(200).json())
  //catch to return 404 status and error
  .catch(err => res.status(404).json({ error: err }))
});

// endpoint that returns all links associated to a specific folder
app.get('/api/v1/folders/:id/links/', (req, res) => {
  // assigns request params to a variable to be used to identify proper records
  const { id } = req.params;
  // queries the 'links database' and uses .where to find any links that have a property folder_id that matches the req.params.id and then returns a promise with those links
  database('links').where({'folder_id': id }).select()
    // consumes the promise and returns a 200 status and the data in the database as json object
    .then(links => res.status(200).json(links))
    //catch to return 500 status and error
    .catch(error => res.status(500).json({ error }))
});

// listen method listens for the server to be started and logs a message to the user.
app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});
// this allows the app t be used in other files, specifically for testing
module.exports = app;
