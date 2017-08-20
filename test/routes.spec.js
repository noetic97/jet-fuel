const configuration = require('../knexfile')['test'];
const database = require('knex')(configuration);
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('Should return the home page with text', (done) => {
    chai.request(server)
    .get('/')
    .end((err, response) => {
      response.should.have.status(200);
      response.should.be.html;
      response.res.text.should.include('Stop wasting time! Add Jet Fuel to your web searches!');
      done();
    })
  });
});

describe('API Routes', () => {
  describe('GET /api/v1/folders', () => {
    before(done => {
      database.migrate.latest()
      .then(() => done())
    });

    beforeEach(done => {
      database.seed.run()
      .then(() => done())
    });

    it('Should return all folders in the DB', (done) => {
      chai.request(server)
      .get('/api/v1/folders')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(1);
        response.body[0].should.have.property('id');
        response.body[0].id.should.not.be.NaN;
        response.body[0].should.have.property('title');
        response.body[0].title.should.equal('Favorites');
        response.body[0].should.have.property('created_at');
        response.body[0].should.have.property('updated_at');
        done();
      });
    });
  })

  describe('POST /api/v1/folders', () => {
    it('Should add a new folder to the DB', (done) => {
      chai.request(server)
      .post('/api/v1/folders')
      .send({
        title: "Sweet folder name"
      })
      .end((err, response) => {
        response.should.have.status(201);
        response.should.be.json;
        response.body.should.have.property('title');
        response.body.title.should.equal('Sweet folder name')
        response.headers.should.have.property('content-type')
        response.headers['content-type'].should.equal('application/json; charset=utf-8')
        done();
      });
    });

    it('SAD PATH - Should return an error message if the folder is missing title', (done) => {
      chai.request(server)
      .post('/api/v1/folders')
      .end((err, response) => {
        response.should.have.status(422);
        response.should.be.json;
        response.body.should.have.property('error');
        response.body.error.should.equal('Missing required parameter title.')
        done();
      });
    });
  });

  describe('GET /api/v1/folders/1', () => {
    it.skip('Should return a specific folder in the DB', (done) => {
      chai.request(server)
      .get('/api/v1/folders/1')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(1);
        response.body[0].should.have.property('id');
        response.body[0].id.should.not.be.NaN;
        response.body[0].should.have.property('title');
        response.body[0].title.should.equal('Favorites');
        response.body[0].should.have.property('created_at');
        response.body[0].should.have.property('updated_at');
        done();
      });
    });

    it('SAD PATH - Should return an error message when an improper id is passed in', (done) => {
      chai.request(server)
      .get('/api/v1/folders/10')
      .end((err, response) => {
        response.should.have.status(404);
        response.should.be.json;
        response.body.should.have.property('error');
        response.body.error.should.equal('Could not find a folder with an id of 10')
        done();
      });
    });
  });

  describe('GET /api/v1/links', () => {
    it('Should return all links in the database', (done) => {
      chai.request(server)
      .get('/api/v1/links')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(2);
        response.body[0].should.have.property('id');
        response.body[0].id.should.not.be.NaN;
        response.body[1].should.have.property('id');
        response.body[1].id.should.not.be.NaN;
        response.body[0].should.have.property('folder_id');
        response.body[0].id.should.not.be.NaN;
        response.body[1].should.have.property('folder_id');
        response.body[1].id.should.not.be.NaN;
        response.body[0].should.have.property('description');
        response.body[0].description.should.equal('github');
        response.body[0].should.have.property('ogURL');
        response.body[0].ogURL.should.equal('https://github.com/noetic97');
        response.body[0].should.have.property('shortURL');
        response.body[0].shortURL.should.equal('https://ghno97');
        response.body[0].should.have.property('created_at');
        response.body[0].should.have.property('updated_at');
        response.body[1].should.have.property('created_at');
        response.body[1].should.have.property('updated_at');
        response.body[0].id.should.not.equal(response.body[1].id);
        done();
      });
    });
  });
});
