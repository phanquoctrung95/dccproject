/**
 * Module Dependencies
 */

var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var nodemon = require('gulp-nodemon');
var karma = require('karma').server;
var replace = require('gulp-replace');

var postprocessLCOV = function() {
    return gulp.src('coverage/lcov.info')
        .pipe(replace('SF:.', 'SF:/home/4M2U/DCC/DCC/app.js'))
        .pipe(gulp.dest('coverage'));
};

gulp.task('test', function () {
    karma.start({
        configFile: __dirname + '/karma.conf.ci.js'
    });
});

/**
 * Gulp Tasks
 */

gulp.task('browser-sync', ['nodemon'], function() {
  browserSync({
    proxy: "localhost",  // local node app address
    port: 5000,  // use *different* port than above
    notify: true
  });
});

gulp.task('nodemon', function (cb) {
  var called = false;
  return nodemon({
    script: 'app.js',
    ignore: [
      'gulpfile.js',
      'node_modules/',
      'client',
      'test'
    ]
  })
  .on('start', function () {
    if (!called) {
      called = true;
      cb();
    }
  })
  .on('restart', function () {
    setTimeout(function () {
      reload({ stream: false });
    }, 1000);
  });
});

gulp.task('default', ['browser-sync'], function () {
  gulp.watch(['client/'], reload);
});
