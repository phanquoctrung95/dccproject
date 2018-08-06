var router = require('express').Router();
var models = require('../../models'); //require toiws file index.js cuar thuw mucj

router.post('/add',function(req, res) {
    models.user_groupModel.add(req.body.userID, req.body.groupID, rs => {
        res.send({
            success: true,
            msg: "get all user if they don't feedback course with course id",
        });
    });
});

module.exports = router;