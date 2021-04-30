const Image = require("@11ty/eleventy-img");
const { DateTime } = require("luxon");
const { readdirSync } = require("fs");

// 11ty plugin to generate multiple image sizes and formats: https://www.11ty.dev/docs/plugins/image/
async function imageShortcode(src, alt, sizes) {
  let metadata = await Image(src, {
    widths: [300, 600],
    formats: ["webp", "jpeg"],
    // this is how I want the src attribute to be prefixed
    urlPath: "/images/",
    // this is where I want the processed images to live
    outputDir: "./dist/images/",
  });

  let imageAttributes = {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
    class: "u-photo",
  };

  return Image.generateHTML(metadata, imageAttributes);
}

module.exports = (config) => {
  // Tell 11ty to use the .eleventyignore and ignore our .gitignore file
  config.setUseGitIgnore(false);

  // Get browserSync to reload after sass changes
  config.addWatchTarget("./src/styles/");
  config.addWatchTarget("./src/_data/themes.json");

  // Don't create a page for images/index.html
  config.addPassthroughCopy("./src/images/");
  config.addPassthroughCopy("./src/theme-fonts/");

  // Use shortcode to process images with above plugin
  config.addNunjucksAsyncShortcode("image", imageShortcode);

  // Organization Collections
  config.addCollection("organizations", (collection) => {
    return collection.getFilteredByGlob("./src/organizations/*.md");
  });

  // Entry Collections
  // Get all directory names from entries directory
  // credit: https://stackoverflow.com/questions/18112204/get-all-directories-within-directory-nodejs
  const entryCollections = readdirSync("./src/entries", { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
  // Create collections for each entry directory
  entryCollections.forEach((dirName) => {
    config.addCollection(dirName, function (collection) {
      // credit: Max Böck Resume
      const byStartDate = (a, b) => {
        if (a.data.start_date && b.data.start_date) {
          return a.data.start_date - b.data.start_date;
        }
        return 0;
      };
      return collection
        .getFilteredByGlob(`./src/entries/${dirName}/*.md`)
        .sort(byStartDate);
    });
  });

  // helper filter (TODO: refactor to dynamically add all filters)
  // Credit: Max Böck Theme Switcher
  config.addFilter("findById", (array, id) => array.find((i) => i.id === id));
  // Credit: Max Böck Resume
  config.addFilter("formatDate", (date, format) =>
    DateTime.fromISO(date, { zone: "utc" }).toFormat(String(format))
  );

  return {
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: "src",
      output: "dist",
    },
  };
};
