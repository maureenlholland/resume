module.exports = (config) => {
  config.addPassthroughCopy("./src/images/");
  config.addCollection("education", (collection) => {
    return collection.getFilteredByGlob("./src/education/*.md");
  });
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
