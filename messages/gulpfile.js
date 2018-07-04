var gulp = require('gulp');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var ts = require('gulp-typescript');

tsProject = ts.createProject('tsconfig.json', function() {
  typescript: require('typescript')
});

gulp.task('ts', function() {
  tsProject.src('src/*.ts')
    .pipe(ts(tsProject))
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
});

gulp.task('watch', function() {
  gulp.watch('src/*.ts', ['ts'])
});

gulp.task('default', ['ts', 'watch']);