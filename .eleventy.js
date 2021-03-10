module.exports = (config) => {
  config.addPassthroughCopy("./src/images/");
  config.addCollection("education", (collection) => {
    // worthwhile to add a helper to fill in org details on entries instead of creating another org collection for reference in templates?
    return collection.getFilteredByGlob("./src/entries/education/*.md");
  });
  config.addCollection("organizations", (collection) => {
    return collection.getFilteredByGlob("./src/organizations/*.md");
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
