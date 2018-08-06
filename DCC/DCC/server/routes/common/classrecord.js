var router = require('express').Router();
var models = require('../../models');
var log = require('../../config/config')["log"];

router.post('/getClassRecordByClassID', function (req, res) {
    models.ClassRecord.getClassRecordByClassID(req.body.classID, function (rs) {
        res.send({
            success: true,
            data: rs
        });
    });
});

router.post('/getClassRecordByCourseTypeID', function (req, res) {
    models.ClassRecord.getClassRecordByCourseTypeID(req.body.courseTypeID, function (rs) {
        res.send({
            success: true,
            data: rs
        });
    });
});

router.post('/getClassRecordByTrainerId', function (req, res) {
    models.ClassRecord.getClassRecordByTrainerId(req.body.trainerID, function (rs) {
        res.send({
            success: true,
            data: rs
        });
    });
});

router.post('/updateStatusConfirmJoin', function (req, res) {
    models.ClassRecord.update({
        confirmJoin: req.body.cofirm
    }, {
            where: {
                classId: req.body.classId,
                traineeId: req.body.traineeId
            }
        }).then(function (result) {
            console.log(result);
            if(result == 0)
            {
                res.send({
                    success: false,
                    msg: 'False update'
                });
            }
            else
            {
                res.send({
                    success: true,
                    msg: 'Succes update'
                });
            }
        });
  
})
module.exports = router;