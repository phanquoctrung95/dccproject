var router = require('express').Router();
var models = require('../../models'); //require toiws file index.js cuar thuw mucj
var log = require('../../config/config')["log"];
var md5 = require('md5');
const fs = require('fs');
var sendEmail = require('../../notification/email');
var auto = require('../../automatic');
var desktop = require('../../notification/desktop');
// Upload file setting
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './client/img/profiles');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + file.originalname);
    }
});
// var upload = multer({
//     storage: storage
// }).single('userPhoto');
var upload = multer({
    storage: storage
}).any();

// generate table to mysql
models.User.sync({
    force: false
});

router.post('/getUserById', function (req, res) {
    models.User.getUserByUserID(req.body.id, function (rs) {
        res.send({
            success: true,
            msg: "send user info",
            data: rs
        })
    })
});
router.post('/getAllTrainer', function (req, res) {
    models.User.getAllTrainer(function (rs) {
        res.send({
            success: true,
            msg: "send trainer list",
            data: rs
        })
    })
});

router.post('/getUserInfo', function (req, res) {
    if (req.cookies.email === req.decoded.email) {
        models.User.getUserByEmail(req.body.email, function (user) {
            var currentRole = user.isAdmin ? 1 :
                                user.isTrainer ? 2 :
                                    user.isTrainee ? 3 : 0;
            res.send({
                id: user.id,
                username: user.username,
                status: user.status,
                dob: user.dob,
                phone: user.phone,
                location: user.location,
                email: user.email,
                password: user.password,
                avatar: user.avatar,
                role: currentRole,
                isAdmin: user.isAdmin,
                isTrainer: user.isTrainer,
                isTrainee: user.isTrainee,
                belong2Team: user.belong2Team,
                isExperienced: user.isExperienced,
                userType: user.userType,
                success: true,
                getCurrentRole: true,
                isNotificationDesktop: user.isNotificationDesktop,
                isNotificationEmail: user.isNotificationEmail,
                EmailPeriod: user.EmailPeriod,
                TimeOption: user.TimeOption
            });
        });
    } else {
        res.status(403).send('Something wrong with Authentication');
    }
});


router.post('/updateUserProfile', function (req, res) {
    models.User.update({
        username: req.body.username,
        avatar: req.body.avatar,
        dob: req.body.dob,
        phone: req.body.phone,
        status: req.body.status,
        isNotificationDesktop: req.body.isNotificationDesktop,
        isNotificationEmail: req.body.isNotificationEmail,
        isAdmin: req.body.isAdmin,
        isTrainer: req.body.isTrainer,
        belong2Team: req.body.belong2Team,
        isExperienced: req.body.isExperienced,
        userType: req.body.userType,
        EmailPeriod: req.body.EmailPeriod,
        TimeOption: req.body.TimeOption
    }, {
        where: {
            email: req.body.email
        }
    }).then(function () {
        auto.job_sendEmail.updateJobs(req.body.email);
        res.send({
            success: true,
            msg: "Update your profile Success"
        });
    });
});

router.post('/changePasswordMD5', function (req, res) {
    models.User.update({
        password: md5(req.body.password),
        status: 'activated',
        isTrainee: true
    }, {
        where: {
            email: req.body.email
        }
    }).then(function () {
        res.send({
            success: true,
            msg: "Update Your Password Success"
        });
    });
});

router.post('/photo', function (req, res) {
    upload(req, res, function () {
        models.User.getUserByEmail(req.headers.email, function (user) {
            models.User.update({
                avatar: '/img/profiles/' + req.files[0].filename
            }, {
                where: {
                    email: req.headers.email
                }
            }).then(function () {
                var previousAvatar = user._previousDataValues.avatar;
                fs.unlink('client' + previousAvatar);
                res.json({
                    success: true,
                    message: 'Upload successful',
                    link: '/img/profiles/' + req.files[0].filename
                })
            })
        });
    });
});
//phuong thuwcs get pharn hooif mootj GET Request vef /getAllUsers page
router.get('/getAllUsers', function (req, res) {
    models.User.getAllUsers(users => {
        var dataSend = {
            success: true,
            msg: 'successfully sent',
            data: users
        };
        res.send(dataSend); //client goij get toiws /user/userProfile/getAllUsers, phuowng thuwcs trar veef dataSend
    });
});

router.post('/getAllUserByCourseID', function(req, res) {
    models.User.getAllUserByCourseID(req.body.courseID, function (rs) {
        res.send({
            success: true,
            msg: "send user by courseID",
            data: rs
        })
    })
});

router.post('/addUser', function (req, res) {
    models.User.sync({
        force: false
    }).then(function () {
        models.User.getUserByEmail(req.body.email, function (result) {
            if (result) {
                res.send({
                    success: false,
                    msg: 'Email already existed. Add failed!'
                });
            } else {
                models.User.create({
                    username: req.body.username,
                    status: 'newuser',
                    dob: '01/01/2001',
                    phone: '0000 000 000',
                    location: 'DEK Vietnam',
                    email: req.body.email,
                    password: md5(req.body.password),
                    avatar: '/img/profiles/defaultProfile.jpg',
                    isAdmin: false,
                    isTrainer: false,
                    isTrainee: false,
                    belong2Team: req.body.team,
                    isExperienced: 0,
                    userType: req.body.userType,
                }).then(function () {
                    models.User.update({
                        username: req.body.username,
                        avatar: '/img/profiles/defaultProfile.jpg',
                        dob: '01/01/2001',
                        phone: '0000 000 000',
                        status: 'newuser',
                        isNotificationDesktop: true,
                        isNotificationEmail: true,
                        isAdmin: false,
                        isTrainer: false,
                        isExperienced: false,
                        EmailPeriod: 'Daily',
                        TimeOption: req.body.TimeOption
                    }, {
                        where: {
                            email: req.body.email
                        }
                    });

                    sendEmail.send([req.body.email], "Register - Account Information", {
                        username: req.body.username,
                        email: req.body.email,
                        password: req.body.password
                    }, 3);

                    res.send({
                        success: true,
                        msg: "Register New User Successfully",
                    });
                });
            }
        });
    });
});

router.post('/checkPassword', function (req, res) {
    models.User.findOne({
        where: {
            email: req.body.email,
            password: md5(req.body.password)
        }
    }).then(result => {
        if (result)
            res.send({
                success: true
            });
        else res.send({
            success: false
        });
    });
});


// --------------------------------------------------------------- TL Team - Ngoc Thanh -------------------------------------------------------


router.get('/getUserDontFeedback', function(req, res) {
    models.User.getUserDontFeedback(function (rs) {
        res.send({
            success: true,
            msg: "get user don't feedback in all class",
            data: rs
        })
    })
});
router.get('/getUserMaxRatingTrainer', function(req, res) {
    models.User.getUserMaxRatingTrainer(function (rs) {
        res.send({
            success: true,
            msg: "get user vote max ratig for trainer in all class",
            data: rs
        })
    })
});
router.get('/getUserMaxRatingContents', function(req, res) {
    models.User.getUserMaxRatingContents(function (rs) {
        res.send({
            success: true,
            msg: "get user vote max rating for contents in all class",
            data: rs
        })
    })
});
router.get('/getUserMaxRatingHappy', function(req, res) {
    models.User.getUserMaxRatingHappy(function (rs) {
        res.send({
            success: true,
            msg: "get user vote max rating for happy in all class",
            data: rs
        })
    })
});

router.post('/getUserHaveImproveComment', function(req, res) {
    models.User.getUserHaveImproveComment(function (rs) {
        res.send({
            success: true,
            msg: "get all user id if they have improve comment",
            data: rs
        })
    })
});

router.post('/getUserDontFeedbackByCourseID',function(req, res) {
    models.User.getUserDontFeedbackByCourseID(req.body.courseID, function (rs) {
        res.send({
            success: true,
            msg: "get all user if they don't feedback course with course id",
            data: rs
        })
    })
});

router.post('/getAllUserDontLearnByGroupID', function(req, res) {
    models.User.getAllUserDontLearnByGroupID(req.body.groupID, function (rs) {
        res.send({
            success: true,
            msg: "Get all user by team id",
            data: rs
        })
    })
});

router.post('/getUserIDByUserEmail', function(req, res) {
    models.User.getUserByEmail(req.body.userEmail, function (rs) {
        res.send({
            success: true,
            msg: "Get user id by user email",
            data: rs
        })
    })
});

module.exports = router;