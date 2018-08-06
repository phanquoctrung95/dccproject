var models = require('../../server/models');
var assert = require('assert');
const crypto = require('crypto');

describe('Test case 1: emailResponseStatus.add', function () {
    it('should return true valid notification', function (done) {
        const hash = crypto.randomBytes(100).toString('hex');
        models.EmailResponseStatus.add('balong123456789@gmail.com', hash, 1 , (rs) => {
            assert.equal(rs.email, 'balong123456789@gmail.com');
            models.EmailResponseStatus.destroy({
                where:{
                    email: 'balong123456789@gmail.com',
                    hash: hash
                }
            });
            done();
        })
    });
});

