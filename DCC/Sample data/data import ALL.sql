

INSERT INTO `DCC2`.`user`(`username`,`status`,`dob`,`phone`,`location`,`email`,`avatar`,`isAdmin`,`isTrainee`,`isTrainer`,`belong2Team`,`userType`,`isExperienced`)VALUES('Thanh Sanh','activated','01/01/2001','0000 000 000','DEK Vietnam','thach@gmail.com','/img/profiles/defaultProfile.jpg',0,1,0,'Team 7Up','CBA',0);
INSERT INTO `DCC2`.`user`(`username`,`status`,`dob`,`phone`,`location`,`email`,`avatar`,`isAdmin`,`isTrainee`,`isTrainer`,`belong2Team`,`userType`,`isExperienced`)VALUES('Quan WE','activated','01/01/2001','0000 000 000','DEK Vietnam','qwe@gmail.com','/img/profiles/defaultProfile.jpg',1,1,0,'Team 7Up','CBA',0);

INSERT INTO `DCC2`.`course_type` (`name`, `discription`) VALUES ('EVERYONE', 'this training program for everyone');
INSERT INTO `DCC2`.`course_type` (`name`, `discription`) VALUES ('OPTIONAL', 'this training program for optional');
INSERT INTO `DCC2`.`course_type` (`name`, `discription`) VALUES ('CBA', 'this training program for CBA');
INSERT INTO `DCC2`.`course_type` (`name`, `discription`) VALUES ('IMS', 'this training program for IMS');
INSERT INTO `DCC2`.`course_type` (`name`, `discription`) VALUES ('AXE', 'this training program for AXE');

INSERT INTO `DCC2`.`training_program` (`name`, `description`, `imgLink`, `courseTypeId`) VALUES ('General Orientation', 'description of trainning program 1 ', '/img/courses/training-icon-1.svg', 1);
INSERT INTO `DCC2`.`training_program` (`name`, `description`, `imgLink`, `courseTypeId`) VALUES ('Linux Programming', 'Description of Linux Programming', '/img/courses/training-icon-2.svg', 2);
INSERT INTO `DCC2`.`training_program` (`name`, `description`, `imgLink`, `courseTypeId`) VALUES ('Soft-Skills', 'Description of Soft Skills', '/img/courses/training-icon-3.svg',2);
INSERT INTO `DCC2`.`training_program` (`name`, `description`, `imgLink`, `courseTypeId`) VALUES ('CBA Overview', 'CBA Overview', '/img/courses/training-icon-3.svg', 3);
INSERT INTO `DCC2`.`training_program` (`name`, `description`, `imgLink`, `courseTypeId`) VALUES ('IMS Overview', 'Description of IMS Overview', '/img/courses/training-icon-3.svg', 4);
INSERT INTO `DCC2`.`training_program` (`name`, `description`, `imgLink`, `courseTypeId`) VALUES ('AXE Overview', 'Description of AXE Overview', '/img/courses/training-icon-3.svg', 5);

/*Courses of trainingProgramId = 1*/
INSERT INTO `DCC2`.`course` (`name`, `description`, `duration`, `imgLink`, `documents`, `test`, `trainingProgramId`) VALUES ('Training Overview ', 'Brief overview for all training courses', '00:15:00', '/img/courses/training-icon-1.svg', 'This is a document of Training Overview course', 'This is a test of Training Overview course', '1');
INSERT INTO `DCC2`.`course` (`name`, `description`, `duration`, `imgLink`, `documents`, `test`, `trainingProgramId`) VALUES ('DEK Organization and Culture  ', '1. Who is D.E.K ?', '01:00:00', '/img/courses/training-icon-2.svg', 'This is a document of DEK Organization and Culture course', 'This is a test of DEK Organization and Culture  course', '1');
INSERT INTO `DCC2`.`course` (`name`, `description`, `duration`, `imgLink`, `documents`, `test`, `trainingProgramId`) VALUES ('Our Customer Ericsson', '1. Ericsson Vision and Core Values', '01:00:00', '/img/courses/training-icon-3.svg', 'This is a document of Our Customer Ericsson course', 'This is a test of Our Customer Ericsson course', '1');
INSERT INTO `DCC2`.`course` (`name`, `description`, `duration`, `imgLink`, `documents`, `test`, `trainingProgramId`) VALUES ('Corporate Policy', '1. How is D.E.K? DEK Culture', '02:00:00', '/img/courses/training-icon-4.svg', 'This is a document of Corporate Policy course', 'This is a test of Corporate Policy course', '1');
/*Courses of trainingProgramId = 2*/
INSERT INTO `DCC2`.`course` (`name`, `description`, `duration`, `imgLink`, `documents`, `test`, `trainingProgramId`) VALUES ('Linux Overview For Users', '1. Introduction', '01:00:00', '/img/courses/training-icon-1.svg', 'This is a document of Linux Overview For Users course', 'This is a test of Linux Overview For Users course', '2');
INSERT INTO `DCC2`.`course` (`name`, `description`, `duration`, `imgLink`, `documents`, `test`, `trainingProgramId`) VALUES ('Linux Overview For Programmers', '1. Linux kernel Architecture', '01:00:00', '/img/courses/training-icon-2.svg', 'This is a document of Linux Overview For Programmers course', 'This is a test of Linux Overview For Programmers course', '2');
/*Courses of trainingProgramId = 3*/
INSERT INTO `DCC2`.`course` (`name`, `description`, `duration`, `imgLink`, `documents`, `test`, `trainingProgramId`) VALUES ('STP Handling - Blade Cluster (Practice)', '1. Concept/Overview about:', '03:00:00', '/img/courses/training-icon-3.svg', 'This is a document of STP Handling - Blade Cluster (Practice) course', 'This is a test of STP Handling - Blade Cluster (Practice) course', '3');
INSERT INTO `DCC2`.`course` (`name`, `description`, `duration`, `imgLink`, `documents`, `test`, `trainingProgramId`) VALUES ('SEAVM Overview', '???', '01:00:00', '/img/courses/training-icon-4.svg', 'This is a document of SEAVM Overview course', 'This is a test of SEAVM Overview course', '3');
/*Courses of trainingProgramId = 4*/
INSERT INTO `DCC2`.`course` (`name`, `description`, `duration`, `imgLink`, `documents`, `test`, `trainingProgramId`) VALUES ('CBA Overview', '1. Overview', '01:00:00', '/img/courses/training-icon-4.svg', 'This is a document of CBA Overview course', 'This is a test of CBA Overview course', '4');
INSERT INTO `DCC2`.`course` (`name`, `description`, `duration`, `imgLink`, `documents`, `test`, `trainingProgramId`) VALUES ('CoreMW Overview', '1. Overview', '01:00:00', '/img/courses/training-icon-1.svg', 'This is a document of CoreMW Overview course', 'This is a test of CoreMW Overview course', '4');
/*Courses of trainingProgramId = 5*/
INSERT INTO `DCC2`.`course` (`name`, `description`, `duration`, `imgLink`, `documents`, `test`, `trainingProgramId`) VALUES ('2G, 3G, 4G', '- Evolution of mobile networks', '01:00:00', '/img/courses/training-icon-2.svg', 'This is a document of 2G, 3G, 4G course', 'This is a test of 2G, 3G, 4G course', '5');
INSERT INTO `DCC2`.`course` (`name`, `description`, `duration`, `imgLink`, `documents`, `test`, `trainingProgramId`) VALUES ('IMS Project Overview', '- IMS teams', '02:00:00', '/img/courses/training-icon-3.svg', 'This is a document of IMS Project Overview course', 'This is a test of IMS Project Overview course', '5');


INSERT INTO `DCC2`.`class` (`courseId`, `startTime`) VALUES ('1', '2017-02-28 00:00:00');
INSERT INTO `DCC2`.`class` (`courseId`, `startTime`) VALUES ('2', '2017-01-15 00:00:00');
INSERT INTO `DCC2`.`class` (`courseId`, `startTime`) VALUES ('3', '2017-02-28 00:00:00');
INSERT INTO `DCC2`.`class` (`courseId`, `startTime`) VALUES ('4', '2017-01-15 00:00:00');

INSERT INTO `DCC2`.`class_record` (`status`,`classId`, `traineeId`) VALUES ('Enrolled','1', 1);
INSERT INTO `DCC2`.`class_record` (`status`,`classId`, `traineeId`) VALUES ('Learned','2', 1);
INSERT INTO `DCC2`.`class_record` (`status`,`classId`, `traineeId`) VALUES ('Enrolled','3', 2);
INSERT INTO `DCC2`.`class_record` (`status`,`classId`, `traineeId`) VALUES ('Learned','4', 2);

INSERT INTO `DCC2`.`request_opening` (`userId`, `courseId`,`requestType`) VALUES (2, '2','register');
INSERT INTO `DCC2`.`request_opening` (`userId`, `courseId`,`requestType`) VALUES (2, '5','register');
