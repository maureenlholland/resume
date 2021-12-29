const { parallel, watch } = require("gulp");
const sass = require("./gulp-tasks/sass.js");
const fonts = require("./gulp-tasks/fonts.js");
const scripts = require("./gulp-tasks/scripts.js");

// Set directory to watch and assign task
const watcher = () => {
  watch("./src/styles/**/*.scss", sass);
  watch("./src/scripts/**/*.js", scripts);
};

// default `gulp` command behaviour is to run each task in parrallel
exports.default = parallel(fonts, sass, scripts);

// `gulp watch` to monitor files on changes
exports.watch = watcher;
