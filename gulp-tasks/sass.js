const { dest, src } = require("gulp");
const cleanCSS = require("gulp-clean-css");
const sassProcessor = require("gulp-sass");

// use canonical rather than node-sass
sassProcessor.compiler = require("sass");

const isProduction = process.env.NODE_ENV === "production";

const sass = () => {
  return (
    // get all sass files
    src("./src/styles/*.scss")
      // convert sass to css
      .pipe(sassProcessor().on("error", sassProcessor.logError))
      // use most aggressive cleanCSS rules in production
      .pipe(
        cleanCSS(
          isProduction
            ? {
                level: 2,
              }
            : {}
        )
      )
      // include source map in development
      .pipe(dest("./dist/css", { sourceMaps: !isProduction }))
  );
};

module.exports = sass;
