module.exports = function(err) {
  var displayErr = gutil.colors.red(err.message);
  gutil.log(displayErr);
  gutil.beep();
  this.emit('end');
}
