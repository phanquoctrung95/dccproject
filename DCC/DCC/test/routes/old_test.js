
// describe('', function() {
//     var Cookies;
//     beforeEach(function(done) {
//         request(route)
//         .post('/login')
//         .set('Accept', 'application/json')
//         .send({
//             username: 'qwe@gmail.com',
//             password: 'qwe'
//         })
//         .end(function(err, res) {
//             Cookies = res.headers['set-cookie'].pop().split(';')[0];
//             if(err)
//             return done(err);
//             done();
//         });
//     });
//  });
//
// // //config database for test environment
// // process.env.NODE_ENV = "test";
// var models = require('../../../server/models');
//
// var globalCookies;
//
// function isEmpty(str) {
//     return (!str || 0 === str.length);
// }

//
// //------------------------------------------------------------------------------
// //------------------------------------------------------------------------------
// //------------------------------------------------------------------------------
// //------------------------------------------------------------------------------
// // describe('<Unit test for Course controller', function() {
// //     describe('', function() {
// //         return it('Test case 1 : POST /course/getCourse', function(done) {
// //             request(route)
// //                 .post('/course/getCourse')
// //                 .send({
// //                     courseID: '1'
// //                 })
// //                 .end(function(err, res) {
// //                     assert.equal(res.body.courseName, 'CBA Overview');
// //                     return done();
// //                 });
// //         });
// //     });
// //
// //     describe('', function() {
// //         return it('Test case 2 : POST /course/addCourse duplicate name', function(done) {
// //             var datasend = {
// //                 courseName: 'CBA Overview',
// //                 courseDescription: 'This is testing Des',
// //                 courseCategory: 'testing cat',
// //                 courseTest: 'testing test',
// //                 courseDocuments: 'testing doc'
// //                 // courseTrainerID: [{
// //                 //     "text": "testing"
// //                 // }]
// //             };
// //             request(route)
// //                 .post('/course/addCourse')
// //                 .send(datasend)
// //                 .end(function(err, res) {
// //                     assert.equal(res.body.msg, 'Name already existed. Add fail!');
// //                     return done();
// //                 });
// //         });
// //     });
// //     describe('', function() {
// //         return it('Test case 3 : POST /course/addCourse success', function(done) {
// //             var datasend = {
// //                 courseName: 'Testing123',
// //                 courseDescription: 'This is testing Des',
// //                 courseCategory: 'testing cat',
// //                 courseTest: 'testing test',
// //                 courseDocuments: 'testing doc'
// //                 // courseTrainerID: [{
// //                 //     "text": "testing"
// //                 // }]
// //             };
// //             request(route)
// //                 .post('/course/addCourse')
// //                 .send(datasend)
// //                 .end(function(err, res) {
// //                     assert.equal(res.body.msg, 'Add course success!');
// //                     return done();
// //                 });
// //             afterEach(function() {
// //                 models.course.destroy({
// //                     where: {
// //                         name: 'Testing123'
// //                     }
// //                 });
// //             });
// //         });
// //     });
// //     describe('', function() {
// //         return it('Test case 4 : POST /course/updateCourse success', function(done) {
// //             var datasend = {
// //                 courseIDEdit: 999,
// //                 courseNameEdit: 'testing3',
// //                 courseDescriptionEdit: 'This is testing Des3',
// //                 courseCategoryEdit: 'testing cat3',
// //                 courseTestEdit: 'testing testing3',
// //                 courseDocumentsEdit: 'testing doc3'
// //                 // courseTrainerIDEdit: [{
// //                 //     "text": "testing3"
// //                 // }]
// //             };
// //             request(route)
// //                 .post('/course/updateCourse')
// //                 .send(datasend)
// //                 .end(function(err, res) {
// //                     assert.equal(res.body.msg, 'Edit course success!');
// //                     return done();
// //                 });
// //         });
// //     });
// //     describe('', function() {
// //         return it('Test case 5 : POST /course/updateCourse : Course not found', function(done) {
// //             var datasend = {
// //                 courseIDEdit: 992,
// //                 courseNameEdit: 'testing3',
// //                 courseDescriptionEdit: 'This is testing Des3',
// //                 courseCategoryEdit: 'testing cat3',
// //                 courseTestEdit: 'testing testing3',
// //                 courseDocumentsEdit: 'testing doc3'
// //                 // courseTrainerIDEdit: [{
// //                 //     "text": "testing3"
// //                 // }]
// //             };
// //             request(route)
// //                 .post('/course/updateCourse')
// //                 .send(datasend)
// //                 .end(function(err, res) {
// //                     assert.equal(res.body.msg, 'Course not found in database');
// //                     return done();
// //                 });
// //         });
// //     });
// //     describe('', function() {
// //         return it('Test case 6 : POST /course/list return courselist', function(done) {
// //             request(route)
// //                 .get('/course/list')
// //                 .end(function(err, res) {
// //                     assert.equal(res.body.msg, 'send list success');
// //                     return done();
// //                 });
// //         });
// //     });
// //     describe('', function() {
// //         return it('Test case 7 : POST /course/isDeletedCourse delete success', function(done) {
// //             request(route)
// //                 .post('/course/isDeletedCourse')
// //                 .send({
// //                     courseIDDelete: 999
// //                 })
// //                 .end(function(err, res) {
// //                     assert.equal(res.body.msg, 'Delete success');
// //                     return done();
// //                 });
// //         });
// //     });
// //     describe('', function() {
// //         return it('Test case 8 : POST /course/isDeletedCourse delete course already deleted', function(done) {
// //             request(route)
// //                 .post('/course/isDeletedCourse')
// //                 .send({
// //                     courseIDDelete: 999
// //                 })
// //                 .end(function(err, res) {
// //                     models.course.update({
// //                         isDeleted: false
// //                     }, {
// //                         where: {
// //                             id: 999
// //                         }
// //                     });
// //                     assert.equal(res.body.msg, 'Delete failure');
// //                     return done();
// //                 });
// //         });
// //     });
// // });
//
//
// describe('<Unit test for Course model', function() {
//     // describe('Method Course', function() {
//     //     return it('Test case 1: getByID with id existed in database - return course object', function(done) {
//     //         models.course.getByID('1', function(course) {
//     //             assert.equal(course.id, 1);
//     //             return done();
//     //         })
//     //     });
//     // });
//     describe('', function() {
//         return it('Test case 2: getByID with id not found in database - return null', function(done) {
//             models.Course.getByID('not found', function(course) {
//                 assert.equal(course, null);
//                 return done();
//             })
//         });
//     });
//     // describe('', function() {
//     //     return it('Test case 3: getByName with name existed in database - return course course object', function(done) {
//     //         models.course.getByName('CBA Overview', function(course) {
//     //             assert.equal(course.name, 'CBA Overview');
//     //             return done();
//     //         })
//     //     });
//     // });
//     describe('', function() {
//         return it('Test case 4: getByName with name not found in database - return course = null', function(done) {
//             models.Course.getByName('not found', function(course) {
//                 assert.equal(course, null);
//                 return done();
//             })
//         });
//     });
//     // describe('', function() {
//     //     return it('Test case 5: getByCategory with category existed in database - return course[] list object ', function(done) {
//     //         models.course.getByCategory('CBA Overview', function(course) {
//     //             assert.equal(course[0].category, 'CBA Overview');
//     //             assert.equal(course[2].category, 'CBA Overview');
//     //             return done();
//     //         })
//     //     });
//     // });
//     describe('', function() {
//         return it('Test case 6: getByTraningProgramID with ID not found in database - return course[] null ', function(done) {
//             models.Course.getByTraningProgramID('99', function(course) {
//                 assert.equal(course[0], null);
//                 return done();
//             })
//         });
//     });
//     // describe('', function() {
//     //     return it('Test case 7: getByTrainerID with trainerID existed in database - return course[] list object', function(done) {
//     //         models.course.getByTrainerID('King Nguyen', function(course) {
//     //             assert.equal(course[0].trainerID, 'King Nguyen');
//     //             return done();
//     //         })
//     //     });
//     // });
//     // describe('', function() {
//     //     return it('Test case 8: getByTrainerID with TrainerID not found in database - return course[] null', function(done) {
//     //         models.course.getByTrainerID('not found', function(course) {
//     //             assert.equal(course[0], null);
//     //             return done();
//     //         })
//     //     });
//     // });
//     // describe('', function() {
//     //     return it('Test case 9: getCourses in database - return course[] list object', function(done) {
//     //         models.course.getCourses(function(course) {
//     //             assert.equal(course[0].id, '1');
//     //             return done();
//     //         })
//     //     });
//     // });
// });
//
// describe('<Unit test for User model>', function() {
//     describe('Method User', function() {
//         return it('Test case 1: getUserByID', function(done) {
//             models.User.getUserByID('1', function(user) {
//                 assert.equal(user.username, 'Test Account');
//                 return done();
//             })
//         });
//     });
//
//     describe('', function() {
//         return it('Test case 2: getUserByName', function(done) {
//             models.User.getUserByName('Test Account', function(user) {
//                 assert.equal(user.id, '1');
//                 return done();
//             })
//         });
//     });
// });
//
// describe('<Unit test for userProfile function>', function() {
//     describe('Send data to font-end', function() {
//         return it('Get /users/getUserInfo ', function(done) {
//             var req = request(route).get('/users/getUserInfo');
//             req.cookies = globalCookies;
//             req
//             .set('Accept','application/json')
//             .end(function(err, res) {
//                 assert.equal(res.body.username, 'Test Account');
//                 assert.equal(res.body.email, 'qwe@gmail.com');
//                 if(err)
//                 return done(err);
//                 done();
//             });
//         });
//     });
//
//     describe('Route for editUserProfile page', function() {
//         return it('Get /users/edituserprofile ', function(done) {
//             request(route)
//             .get('/users/edituserprofile')
//             .expect(200, done)
//         });
//     });
//
//     describe('Edit data method', function() {
//         return it('Post /users/userprofileReturnValue ', function(done) {
//             var req = request(route).post('/users/userprofileReturnValue');
//             req.cookies = globalCookies;
//             req
//             .set('Accept','application/json')
//             .send({
//                 status: 'vhlam',
//                 dob: '20/10/1995'
//             })
//             .end(function(err, res) {
//                 assert.equal(res.body.msg, 'Success');
//                 if(err)
//                 return done(err);
//                 done();
//             });
//         });
//     });
//
//     describe('Upload avatar method', function() {
//         return it('Post /users/photo ', function(done) {
//             var req = request(route).post('/users/photo');
//             req.cookies = globalCookies;
//             req
//             .set('Accept','application/json')
//             .field('filename', 'test file')
//             .attach('userPhoto', 'test/test.jpg')
//             .end(function(err, res) {
//                 assert.equal(res.status, '200');
//                 if(err)
//                 return done(err);
//                 done();
//             });
//         });
//     });
// });
//
// describe('<Unit test for feedback function>', function() {
//
//     describe('', function() {
//         return it('Test case 1 : Create a comment for course that doesnt have comment ', function(done) {
//             var req = request(route).post('/feedback/comment');
//             req.cookies = globalCookies;
//             req
//             // .set('Accept','application/json')
//             .send({
//                 classId: 9,
//                 comment: 'feedback test',
//                 userId:1,
//             })
//             .end(function(err, res) {
//                 assert.equal('create successfully', 'create successfully');
//                 if(err)
//                 return done(err);
//                 done();
//             });
//         });
//     });
//
//     describe('', function() {
//         return it('Test case 2 : Update comment for course having comment already', function(done) {
//             var req = request(route).post('/feedback/comment');
//             req.cookies = globalCookies;
//             req
//             .send({
//                 classId: 1,
//                 comment: 'update feedback',
//                 userId:1,
//             })
//             .end(function(err,res){
//                 assert.equal(res.body.msg,'update successfully');
//                 if(err)
//                 return done(err);
//                 done();
//             })
//         });
//     });
//
//     describe('', function() {
//         return it('Test case 3 : show feedbacks of a class by its ID', function(done) {
//             var req = request(route).post('/feedback/getClassFeedbacks');
//             req.cookies = globalCookies;
//             req
//             .send({
//                 classId: 1,
//             })
//             .end(function(err,res) {
//                 //assert.equal(res.body[0].comment, 'show feedbacks of a course by its ID');
//                 assert.equal('', '');
//                 if(err)
//                 return done(err);
//                 done();
//             });
//             courseID: 10
//             afterEach(function() {
//                 models.Feedback.destroy({
//                     where: {
//                         courseID: 10
//                     }
//                 });
//             });
//         });
//     });
//
//     describe('', function() {
//         return it('Test case 4 : Create a rating for course that doesnt have rating', function(done) {
//             var req = request(route).post('/feedback/rating');
//             req.cookies = globalCookies;
//             req
//             .send({
//                 classId: 99,
//                 userId:1,
//                 rating: 3
//             })
//             .end(function(err,res){
//                 assert.equal('create successfully', 'create successfully');
//                 if(err)
//                 return done(err);
//                 done();
//             });
//         });
//     });
//
//     describe('', function() {
//         return it('Test case 5 : Update rating for course having rating already', function(done) {
//             var req = request(route).post('/feedback/rating');
//             req.cookies = globalCookies;
//             req
//             .send({
//                 userId: 1,
//                 classId: 1,
//                 rating: 4
//             })
//             .end(function(err,res){
//                 assert.equal(res.body.msg,'update successfully');
//                 if(err)
//                 return done(err);
//                 done();
//             });
//         });
//     });
//
//     describe('', function() {
//         return it('Test case 6 : show average rating', function(done) {
//             var req = request(route).post('/feedback/showAverageRating');
//             req.cookies = globalCookies;
//             req
//             .send({
//                 classId: 1,
//             })
//             .end(function(err,res){
//                 assert.equal(res.body.result, res.body.result);
//                 if(err)
//                 return done(err);
//                 done();
//             });
//         });
//     });
//
// });
//
// //-----------------------------------------------------------------------
