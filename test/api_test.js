let chai = require('chai');
let chaiHttp = require('chai-http');
var should = chai.should();
chai.use(chaiHttp);
let server = require('../app');

const mockRoomId = 1000;
const invalidRoomId = 1;
const testImageURL = "https://hot-take.s3.ca-central-1.amazonaws.com/1620524758357.jpg";
const mockRanking = [testImageURL, testImageURL];

//Our parent block
describe('Room', () => {
    describe('/POST Create Room', () => {
        it('it should create a room and return roomId', (done) => {
            chai.request(server)
                .post(`/api/createRoom?id=${mockRoomId}`)
                .end((err, res) => {
                    console.log(res.body);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.roomId.should.be.eql(JSON.stringify(mockRoomId));
                    done();
                });
        });
    });
    describe('/POST addImages', () => {
        it('it should POST an image to a valid room', (done) => {
            chai.request(server)
                .post(`/api/addImages/${mockRoomId}?src=${testImageURL}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.message.should.be.eql("SUCCESS");
                    done();
                });
        });
        it('it should not POST an image for invalid room', (done) => {
            chai.request(server)
                .post(`/api/addImages/${invalidRoomId}?src="${testImageURL}"`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.message.should.be.eql("FAILED");
                    done();
                });
        });
    });
    describe('/GET getImages', () => {
        it('it should GET all images from a valid room', (done) => {
            chai.request(server)
                .get(`/api/getImages/${mockRoomId}`)
                .end((err, res) => {
                    (res).should.have.status(200);
                    (res.body).should.be.a('array');
                    (res.body.length).should.be.eql(1);
                    done();
                });
        });
        it('it should GET empty array from invalid room', (done) => {
            chai.request(server)
                .get(`/api/getImages/${invalidRoomId}`)
                .end((err, res) => {
                    (res).should.have.status(200);
                    (res.body).should.be.a('array');
                    (res.body.length).should.be.eql(0);
                    done();
                });
        });
    });
    describe('/POST addRanking', () => {
        it('it should POST a ranking to a valid room', (done) => {
            chai.request(server)
                .post(`/api/addRanking/${mockRoomId}?ranking=${JSON.stringify(mockRanking)}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.message.should.be.eql("SUCCESS");
                    done();
                });
        });
        it('it should not POST a ranking to an invalid room', (done) => {
            chai.request(server)
                .post(`/api/addRanking/${invalidRoomId}?ranking=${JSON.stringify(mockRanking)}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.message.should.be.eql("FAILED");
                    done();
                });
        });
    });
    describe('/GET getScores', () => {
        it('it should GET scores to a valid room', (done) => {
            chai.request(server)
                .get(`/api/getScores/${mockRoomId}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    done();
                });
        });
        it('it should not GET scores to an invalid room', (done) => {
            chai.request(server)
                .get(`/api/getScores/${invalidRoomId}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });
});