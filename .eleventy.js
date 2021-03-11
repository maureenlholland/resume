module.exports = (config) => {
  // Tell 11ty to use the .eleventyignore and ignore our .gitignore file
  config.setUseGitIgnore(false);
  // Get browserSync to reload after sass changes
  config.addWatchTarget("./src/styles/");
  // Don't create a page for images/index.html
  config.addPassthroughCopy("./src/images/");
  // Collections to grab in templates
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
