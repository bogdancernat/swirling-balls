var os    = require('os') 
, gulp    = require('gulp')
, connect = require('gulp-connect')
, open    = require('gulp-open')
, port = 8000
;
 
gulp.task('connect', function() {
  connect.server({
    root: './',
    port: port,
    livereload: true
  });
});
 
gulp.task('html', function () {
  gulp.src('./*.html')
    .pipe(connect.reload());
});

gulp.task('open', function () {
  gulp.src(__filename)
  .pipe(open({uri: 'http://localhost:' + port}));
});

gulp.task('js', function () {
  gulp.src('./js/*.js')
    .pipe(connect.reload());
});
 
gulp.task('watch', function () {
  gulp.watch(['./*.html'], ['html']);
  gulp.watch(['./js/*.js'], ['js']);
});
 
gulp.task('default', ['connect', 'open', 'watch']);