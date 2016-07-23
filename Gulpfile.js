var srcFiles = require('./srcFiles.js');

var gulp = require('gulp');
var groupTasks = require('./gulp-tasks/groupTasks.js');
var sassTask = require('./gulp-tasks/sass.js');
var jsTask = require('./gulp-tasks/js.js');

var livereload  = require('gulp-livereload');
var rm = require('gulp-rimraf');


gulp.task('clean', function() {
  return gulp.src(['dist']).pipe(rm());
});

gulp.task('scripts:main', function() {
  return jsTask('main');
});

gulp.task('sass:screen', function () {
  return sassTask('screen');
});


Object.keys(srcFiles.assets).forEach(function(group){
  gulp.task('copy:' + group, function(){
    return gulp.src(srcFiles.assets[group]).pipe(gulp.dest('dist/assets/' + group)).pipe(livereload());
  });
});


gulp.task('sass', groupTasks('sass:'));
gulp.task('scripts', groupTasks('scripts:'));
gulp.task('copy', groupTasks('copy:'));

gulp.task('build', ['clean'], function(){
  gulp.start(['scripts', 'sass', 'copy']);
});

gulp.task('default', ['build'], function() {
  livereload.listen();

  Object.keys(srcFiles.stylesheets).forEach(function(source){
    if (source !== 'defaultDest' && srcFiles.stylesheets[source].watch) {
      gulp.watch(srcFiles.stylesheets[source].watch, ['sass:' + source]);
    }
  });

  Object.keys(srcFiles.scripts).forEach(function(source){
    if (source !== 'defaultDest') {
      gulp.watch(srcFiles.scripts[source].files, ['scripts:' + source]);
    }
  });

  Object.keys(srcFiles.assets).forEach(function(source){
    gulp.watch(srcFiles.assets[source], ['copy:' + source]);
  });
});