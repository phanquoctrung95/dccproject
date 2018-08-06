var router = require('express').Router();
var models = require('../../models');
var log = require('../../config/config')["log"];

router.get('/getAdminRequestOpenCourse', function (req, res) {
    var query = {
        include: [models.RequestOpening]
    };

    models.Course.findAll(query).then(function (courses) {
        var resData = [];
        // check if have request openning
        courses.forEach(course => {
            if (course.RequestOpenings.length > 0) {
                var requestUsers = [];
                course.RequestOpenings.forEach(request => {
                    requestUsers.push(request.userId);
                })

                resData.push({
                    course: {
                        id: course.id,
                        name: course.name,
                        description: course.description,
                        imgLink: course.imgLink,
                    },
                    numberOfRequest: course.RequestOpenings.length,
                    traineeList: requestUsers,
                })
            }
        })
        var datasend = {
            success: true,
            msg: 'send list success',
            data: resData
        };
        res.send(datasend);

    });

});
router.post('/getInfoRequestCourse', function (req, res) {
    var query = {
        include: [models.RequestOpening],
        where:{
            id: req.body.courseId
        }
    };
    models.Course.findOne(query).then(function (course) {
        var datasend;
        // check if have request openning
        if (course.RequestOpenings.length > 0) {
            var requestUsers = [];
            course.RequestOpenings.forEach(request => {
                requestUsers.push({id: request.userId});
            })
            var courseInfo = {
                id: course.id,
                name: course.name,
                description: course.description,
                imgLink: course.imgLink,
                numberOfRequest: course.RequestOpenings.length,
                traineeList: requestUsers,
            };
            datasend = {
                success: true,
                msg: 'get success',
                data: courseInfo
            };
        }
        else {
            datasend = {
                success: false,
                msg: 'get fail'
            };
        }
        res.send(datasend);
    });

});

module.exports = router;
