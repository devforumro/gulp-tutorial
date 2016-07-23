var gulp = require('gulp');

module.exports = function(name) {
  return Object.keys(gulp.tasks).filter(function(task){
    return task.indexOf(name) != -1;
  });
}