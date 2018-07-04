var gulp = require("gulp");
var typescript = require('gulp-typescript');

gulp.task("default", () => {
  var pj = typescript.createProject("./tsconfig.json");

  gulp.src([
      "./**/*.ts",
      "!./node_modules/**"
    ])
    .pipe(pj())
    .js
    .pipe(gulp.dest("./"));
});