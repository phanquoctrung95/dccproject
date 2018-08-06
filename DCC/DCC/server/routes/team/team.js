var router = require('express').Router();
var models = require('../../models'); //require toiws file index.js cuar thuw mucj

router.post('/getTeamName',function(req, res) {
    models.teamModel.getTeamName(function (rs) {
        res.send({
            success: true,
            msg: "Get team name",
            data: rs
        })
    })
});

module.exports = router;