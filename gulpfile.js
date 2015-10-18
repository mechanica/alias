var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var eslint = require('gulp-eslint');
var gutil = require('gulp-util');
var reactify = require('reactify');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');

gulp.task('lint', function () {
  return gulp.src(['client/**/*.js', 'index.js', 'gulpfile.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    ;
});

gulp.task('browserify', function() {
  return browserify('client/js/main.js', {
    debug: true
  }).transform(reactify)
    .bundle()
    .on('error', function (error) {
      gutil.log(
        gutil.colors.cyan('Browserify') + gutil.colors.red(' found unhandled error:\n'),
        error.toString()
      );
      this.emit('end');
    })
    .pipe(source('main.js'))
    .pipe(gulp.dest('public/js'))
    ;
});

gulp.task('css', function () {
  var processors = [
    require('autoprefixer-core')({browsers: ['last 2 version']}),
    require('postcss-import')(),
    require('postcss-nested')(),
    require('postcss-color-function')()
  ];
  return gulp.src('client/**/*.css')
    .pipe(plumber())
    .pipe(postcss(processors))
    .on('error', function (error) {
      gutil.log(
        gutil.colors.cyan('PostCSS') + gutil.colors.red(' found unhandled error:\n'),
        error.toString()
      );
      this.emit('end');
    })
    .pipe(gulp.dest('./public'))
    ;
});

gulp.task('static', function () {
  return gulp.src('client/static/**/*')
    .pipe(gulp.dest('./public'))
    ;
});

gulp.task('watch', ['default'], function() {
  gulp.watch(['client/**/*.js'], ['lint', 'browserify']);
  gulp.watch(['client/**/*.css'], ['css']);
});

gulp.task('default', ['lint', 'browserify', 'css']);
