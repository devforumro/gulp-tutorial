module.exports = {
  scripts : {
    defaultDest: 'dist/assets/javascripts',
    main : {
      files: ['src/assets/javascripts/main/**/*.js']
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