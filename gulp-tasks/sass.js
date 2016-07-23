var srcFiles = require('../srcFiles.js');
var gulp = require('gulp');

var err = require('./err.js');

var livereload  = require('gulp-livereload');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var clone = require('gulp-clone');
var merge = require('merge-stream');
var rename = require('gulp-rename');

var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssmin = require('gulp-cssmin');

module.exports = function(name){
  var sassOptions = { outputStyle: 'expanded' };
  var dest = srcFiles.stylesheets[name].dest || srcFiles.stylesheets.defaultDest;
  var source = gulp.src(srcFiles.stylesheets[name].files)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions)).on('error', err)
    .pipe(postcss([
      autoprefixer({browsers: ['last 2 versions']}),
    ]));

  var pipe1 = source.pipe(clone())
    .pipe(sourcemaps.write('.', { sourceRoot: null }))
    .pipe(gulp.dest(dest));

  if (!srcFiles.stylesheets[name].skipMinify) {
    return pipe1.pipe(livereload());
  }

  var pipe2 = source.pipe(clone())
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('.', { sourceRoot: null }))
    .pipe(gulp.dest(dest));

  return merge(pipe1, pipe2).pipe(livereload());

}