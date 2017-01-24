var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');

var autoprefixer = require('gulp-autoprefixer'); 
var cleanCSS = require('gulp-clean-css');

var uglify = require('gulp-uglify');


gulp.task('css', function() {
  return gulp.src('styles/*.css')
    .pipe(concat('style.min.css'))
    .pipe(autoprefixer())
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('styles/dist/'));
});

gulp.task('js', function() {
  return gulp.src(['scripts/function-box.js', 'scripts/app.js'])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('scripts/dist/'));
});

gulp.task('router-minify', function() {
  return gulp.src('scripts/router.js')
    .pipe(uglify())
    .pipe(rename('router.min.js'))
    .pipe(gulp.dest('scripts/dist'));
});

gulp.task('watch', function () {
  gulp.watch(['styles/*.css'], ['css']);
});