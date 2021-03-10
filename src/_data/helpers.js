module.exports = {
  getOrganization(path, organizations) {
    return organizations.find((org) => new RegExp(org.fileSlug).test(path));
  },
};
