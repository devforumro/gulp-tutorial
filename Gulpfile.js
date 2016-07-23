var gulp = require('gulp');
var livereload  = require('gulp-livereload');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var clone = require('gulp-clone');
var merge = require('merge-stream');
var rename = require('gulp-rename');
var path = require('path');
var fs = require('fs');
var rm = require('gulp-rimraf');

var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssmin = require('gulp-cssmin');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');


function err(err) {
  var displayErr = gutil.colors.red(err.message);
  gutil.log(displayErr);
  gutil.beep();
  this.emit('end');
}


var srcFiles = {
  scripts : {
    defaultDest: 'dist/assets/stylesheets',
    main : {
      files: ['src/assets/javascripts/main/**/*.js'],
      dest: 'dist/assets/stylesheets'

    },
    utils: [],
    admin : [],
    vendor : []
  },

  stylesheets: {
    defaultDest: 'dist/assets/stylesheets',
    screen : {
      files: ['src/assets/stylesheets/screen/screen.scss'],
      watch: ['src/assets/stylesheets/screen/**/*.scss'],
      dest: 'dist/assets/stylesheets2'
    },
    grid : [
      'src/assets/stylesheets/grid/grid.scss'
    ],
    vendor : [
      'src/assets/stylesheets/vendor/vendor.scss'
    ],
  },

  assets: {
    images : ['src/assets/images/**/*'],
    content : ['src/content/**/*'],
    fonts : ['src/assets/fonts/**/*'],
  }
};


function getSassTask(name) {
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

  var pipe2 = source.pipe(clone())
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('.', { sourceRoot: null }))
    .pipe(gulp.dest(dest));

  return merge(pipe1, pipe2).pipe(livereload());
}

function getScriptTask(name) {
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


gulp.task('clean', function() {
  return gulp.src(['dist']).pipe(rm());
});

gulp.task('scripts:main', function() {
  return getScriptTask('main');
});


gulp.task('sass:screen', function () {
  return getSassTask('screen');
});


function groupTasks(name) {
  return Object.keys(gulp.tasks).filter(function(task){
    return task.indexOf(name) != -1;
  });
}

gulp.task('sass', groupTasks('sass:'));
gulp.task('scripts', groupTasks('scripts:'));


gulp.task('build', ['clean'], function(){
  gulp.start(['scripts', 'sass']);
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
});