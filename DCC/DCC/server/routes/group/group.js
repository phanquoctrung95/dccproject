var router = require('express').Router();
var models = require('../../models'); //require toiws file index.js cuar thuw mucj

router.post('/getgroupName',function(req, res) {
    models.groupModel.getgroupName(function (rs) {
        res.send({
            success: true,
            msg: "Get group name",
            data: rs
        })
    })
});

module.exports = router;