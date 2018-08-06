var router = require('express').Router();
var models = require('../../models');
var log = require('../../config/config')["log"];

router.post ('/getMyFeedbackByClass', function(req, res){
    models.ClassRecord.getTraineeClassbyId(req.body.traineeId, req.body.classId, feedback => {
        if(!feedback.bestThing_comments&&!feedback.trainer_rating&&!feedback.improve_comments&&!feedback.content_rating&&!feedback.happy_rating){
            var datasend = {
                success: false,
                msg: 'There is no feedback of traineeId = ' + req.body.traineeId + ' for class with id = ' + req.body.classId,
                feedback: {
                    bestThing_comments: '',
                    trainer_rating: '0',
                    improve_comments: '',
                    content_rating: '0',
                    happy_rating: '0'
                }
            };
            res.send(datasend);
        }
        else{
            var datasend2 = {
                success: true,
                msg:'Get feedback success',
                feedback: {
                    bestThing_comments: feedback.bestThing_comments,
                    trainer_rating: feedback.trainer_rating,
                    improve_comments: feedback.improve_comments,
                    content_rating: feedback.content_rating,
                    happy_rating: feedback.happy_rating
                }
            };
            res.send(datasend2);
        }
    });
});

router.post ('/sendFeedback', function(req, res){
    // this function check if the user used comment for class
    models.ClassRecord.update({
        bestThing_comments: req.body.bestThing_comments,
        trainer_rating: req.body.trainer_rating,
        improve_comments: req.body.improve_comments,
        content_rating: req.body.content_rating,
        happy_rating: req.body.happy_rating
    }, {
        where: {
            traineeId: req.body.traineeId,
            classId: req.body.classId
        }
    }).then(function() {
        res.send({
            success: true,
            msg: 'update Feedback success!'
        });
    });
});

module.exports = router;
