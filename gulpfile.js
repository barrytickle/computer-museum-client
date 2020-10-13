var gulp = require('gulp'),
    notify = require('gulp-notify'),
    filter = require('gulp-filter'),
    sass = require('gulp-ruby-sass'),
    order = require('gulp-order'),
    watch = require('gulp-watch'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    util = require('gulp-util'),
    minify = require('gulp-minify'),
    pipeline = require('readable-stream').pipeline,
    cleanCSS = require('gulp-clean-css'),
    clean = require('gulp-clean');


    browserSync = require('browser-sync').create();

    var reload = browserSync.reload;


//SCCS Compile
gulp.task('sass', () =>
    sass('app/scss/*.scss', {style: 'expanded'})
        .on('error', sass.logError)
        .pipe(minify())
        .pipe(gulp.dest('app/css', {overwrite: true}))
        .pipe(notify({message: 'SCCS task complete innit!'})),
    reload
);

gulp.task('minify-css', () => {
    return gulp.src('app/css/*.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(clean())
        .pipe(gulp.dest('public/css', {overwrite: true}));
});

//JS Files
gulp.task('uglify', function() {
  const jsFiles = ['app/js/**/*.js'];
  return pipeline(
      gulp.src(jsFiles)
          .pipe(order([
              'jquery.min.js',
              '*',
              'scripts.js'
          ])),
      concat('main.js'),
      minify(),
      gulp.dest('public/js', {overwrite: true}),
      notify({message: 'task complete'})
  );
});



//watch
gulp.task('watch', function() {

  //js files
  gulp.watch('app/js/**/*', gulp.series('uglify'));
  //sass files
  gulp.watch('app/scss/**/*', gulp.series('sass'));
  //minify
  gulp.watch('app/css/*', gulp.series('minify-css'));

});
