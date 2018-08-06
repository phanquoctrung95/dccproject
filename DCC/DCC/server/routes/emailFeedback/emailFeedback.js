var router = require('express').Router();
var models = require('../../models'); //require toiws file index.js cuar thuw mucj

router.get('/getAllInfoAboutUserDontFeedback',function(req, res) {
    models.emailFeedback.getAllInfoAboutUserDontFeedback(rs => {
        res.send({
            success: true,
            msg: "get all user if they don't feedback course with course id",
            data: rs
        });
    });
});
router.get('/getAllInfoAboutUserIsSentEmailFeedbacMoreThreeDays',function(req, res) {
    models.emailFeedback.getAllInfoAboutUserIsSentEmailFeedbacMoreThreeDays(rs => {
        res.send({
            success: true,
            msg: "send done",
            data: rs
        });
    });
});

module.exports = router;