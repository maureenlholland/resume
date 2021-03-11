const { parallel, watch } = require("gulp");
const sass = require("./gulp-tasks/sass.js");
const browserSync = require("browser-sync").create();

// Set directory to watch and assign task
const watcher = () => {
  watch("./src/styles/**/*.scss", sass).on("change", browserSync.reload);
};

// default `gulp` command behaviour is to run each task in parrallel
exports.default = parallel(sass);

// `gulp watch` to monitor files on changes
exports.watch = watcher;
