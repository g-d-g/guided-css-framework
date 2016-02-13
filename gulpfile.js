var sass = require('gulp-sass'),
  bs = require('browser-sync'),
  gulp = require('gulp'),
  sourcemaps = require('gulp-sourcemaps'),
  postcss = require('gulp-postcss'),
  // use postcss nested syntax
  nested = require('postcss-nested'),
  // apply PostCSS transformations directly to SCSS code
  scss = require('postcss-scss'),
  cssnano = require('gulp-cssnano'),
  rename = require('gulp-rename'),
  // browserSync = require('browser-sync').create(),
  rucksack = require('gulp-rucksack'),
  gulpsync = require('gulp-sync')(gulp),
  autoprefixer = require('autoprefixer'),
  // import helper functions for postcss transforms
  helpers = require('./js/_helper-functions')

// browser list for auto prefixer
var browserList = '> 5%, ie >= 6, last 2 version, Firefox > 20, Android >= 30',
  // postcss map options
  opts = {
    basePath: 'css/variable-maps/',
    maps: ['colors.yml', 'variables.yml']
  },
  paths = {
    sass: 'css/**/*.scss',
    css: './css/*.css'
  }


// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {
  bs.init({
      server: './'
    })
    // watch sass and html changes
  gulp.watch('css/**/*.scss', ['sass'])
  gulp.watch('./*.html').on('change', bs.reload)
})

// Parse scss files with postcss
gulp.task('postcss', function() {
  return gulp.src(paths.sass)
    .pipe(sourcemaps.init())
    // call postcss with plugins
    .pipe(postcss([require('postcss-map')(opts),
      // postcss functions in JS
      require('postcss-functions')({
        // custom functions module(helpers)
        functions: helpers
      }),
      nested, autoprefixer({
        browsers: browserList
      })
    ], {
      syntax: scss
    }))
    .pipe(sourcemaps.write('./source-maps/postcss'))
    // output to same destination/overwrite
    .pipe(gulp.dest('./css'))
    //.pipe(bs.stream())
})

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
  return gulp.src('css/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write('./source-maps/sass'))
    .pipe(gulp.dest('./css'))
    .pipe(bs.stream())
})

// run postcss for ie8
gulp.task('rucksack', function() {
  return gulp.src('css/main.css')
    .pipe(sourcemaps.init())
    // .pipe(postcss([
    //   // merge media query
    //   require("css-mqpacker")()
    // ]))
    // rucksack
    .pipe(rucksack({
      alias: false,
      responsiveType: false,
      shorthandPosition: false,
      quantityQueries: false,
      inputPseudo: false,
      fontPath: false,
      hexRGBA: false,
      easings: false,
      autoprefixer: false,
      clearFix: false,
      fallbacks: true
    }))
    .pipe(sourcemaps.write('./source-maps/rucksack'))
    .pipe(gulp.dest('./css/final-css'))
    .pipe(bs.stream())
})

// transpile sass to css, use gulpsync to first complete postcss parse
gulp.task('css', gulpsync.sync(['postcss', 'sass']))
gulp.task('default', ['serve'])
