const { dest, src } = require("gulp");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");

//   todo: compile to single file, add sourcemaps
const scripts = () => {
  return (
    // get all scripts files
    src("./src/scripts/*.js")
      .pipe(concat({ path: "main.js" }))
      .pipe(
        //   process ES6 for cross-browser compatibility
        babel({ presets: ["@babel/env"] })
      )
      .pipe(
        //   minify js scripts
        uglify()
      )
      .pipe(dest("./dist/js", { sourcemaps: true }))
  );
};

module.exports = scripts;
