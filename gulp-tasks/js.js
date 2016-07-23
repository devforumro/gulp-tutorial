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


var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');


module.exports = function(name){
  var dest = srcFiles.scripts[name].dest || srcFiles.scripts.defaultDest;;
  var source = gulp.src(srcFiles.scripts[name].files);

  if (!srcFiles.scripts[name].skipLint) {
    source = source.pipe(jshint()).pipe(jshint.reporter('jshint-stylish'))
  }

  source = source.pipe(sourcemaps.init())
    .pipe(concat(name + '.js'));

  var pipe1 = source.pipe(clone())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dest));

  var pipe2 = source.pipe(clone())
    .pipe(rename({
      basename: name,
      suffix: '.min'
    }))
    .pipe(uglify()).on('error', err)
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dest));

  return merge(pipe1, pipe2).pipe(livereload());
}