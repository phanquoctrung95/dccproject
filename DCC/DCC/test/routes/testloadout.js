var request = require('supertest');
var assert = require('chai').assert;
var expect = require('chai').expect;
process.env.NODE_ENV ="environment";
var DCC_Server = require('../../app.js');


describe('Test case 0: get homepage without logging in', function () {
    return it('Should return success==true', function (done) {
        request(DCC_Server)
            .get('/')
            .end(function (err, res) {
                if(res.status == '200')
                    assert.notEqual(res.body, null);
                if (err) return done(err);
                done();
            });
    });
});
