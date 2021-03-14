const gulp = require('gulp')
const sass = require('gulp-dart-sass')
const useref = require('gulp-useref')
const purgecss = require('gulp-purgecss')
const uglify = require('gulp-uglify')
const gulpif = require('gulp-if')
const cssnano = require('gulp-cssnano')
const imagemin = require('gulp-imagemin')
const cache = require('gulp-cache')
const autoprefixer = require('gulp-autoprefixer')
const babel = require('gulp-babel')
const sourcemaps = require('gulp-sourcemaps')
var csso = require('gulp-csso')

gulp.task('purgecss', () => {
  return gulp
    .src('dist/**/*.css')
    .pipe(
      purgecss({
        content: ['dist/**/*.html'],
      }),
    )
    .pipe(csso())
    .pipe(gulp.dest('dist'))
})

gulp.task('babel', () => {
  return gulp
    .src('app/js/jsfile1.js')
    .pipe(
      babel({
        presets: ['@babel/preset-env'],
      }),
    )
    .pipe(gulp.dest('dist/js'))
})

gulp.task('fonts', function () {
  return gulp.src('app/fonts/**/*').pipe(gulp.dest('dist/fonts'))
})

gulp.task('images', function () {
  return (
    gulp
      .src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
      // Caching images that ran through imagemin
      .pipe(
        cache(
          imagemin({
            interlaced: true,
          }),
        ),
      )
      .pipe(gulp.dest('dist/images'))
  )
})

gulp.task('useref', () => {
  return gulp
    .src('app/index.html')
    .pipe(useref())
    .pipe(gulpif('*.js', uglify()))
    .pipe(
      gulpif(
        '*.js',
        babel({
          presets: ['@babel/preset-env'],
        }),
      ),
    )
    .pipe(gulpif('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
})

gulp.task('sass', () => {
  return gulp
    .src(['app/scss/**/*.scss'])
    .pipe(sourcemaps.init())

    .pipe(sass())
    .pipe(
      autoprefixer({
        cascade: false,
      }),
    )
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('app/css'))
})

gulp.task('watch', () => {
  gulp.watch(['app/scss/**/*.scss'], gulp.series(['sass']))
})

gulp.task(
  'build',
  gulp.series(['sass', 'useref', 'purgecss', 'images', 'fonts']),
)
