const Image = require("@11ty/eleventy-img");

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

  // Use shortcode to process images with above plugin
  config.addNunjucksAsyncShortcode("image", imageShortcode);

  // Collections to grab in templates (TODO: refactor to dynamically add entry collections)
  config.addCollection("education", (collection) => {
    return collection.getFilteredByGlob("./src/entries/education/*.md");
  });
  config.addCollection("research", (collection) => {
    return collection.getFilteredByGlob("./src/entries/research/*.md");
  });
  config.addCollection("teaching", (collection) => {
    return collection.getFilteredByGlob("./src/entries/teaching/*.md");
  });
  config.addCollection("organizations", (collection) => {
    return collection.getFilteredByGlob("./src/organizations/*.md");
  });

  // helper filter (TODO: add date filter, refactor to dynamically add all filters)
  config.addFilter("findById", (array, id) => array.find((i) => i.id === id));

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
