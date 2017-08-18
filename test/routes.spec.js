const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
// const seedData = require('../db/seeds/dev/folders')

chai.use(chaiHttp);
// beforeEach((done) => {
//   console.log(seedData.seed());
//   console.log(server);
//   done()
// })

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

  it('Should return all of the folders in the DB', (done) => {
    chai.request(server)
    .get('/api/v1/folders')
    .end((err, response) => {
      response.should.have.status(200);
      response.should.be.json;
      response.body.should.be.a('array');
      // response.body.length.should.equal(3);
      response.body[0].should.have.property('id');
      // response.body[0].id.should.equal('1');
      response.body[0].should.have.property('title');
      // response.body[0].title.should.equal('1');
      response.body[0].should.have.property('created_at');
      response.body[0].should.have.property('updated_at');
      done();
    })
  })
});
