const { readFile, open, writeFile } = require('fs');
const { PackageVersion } = require('./npm.service');

const filePath = './package_versions.json';

exports.getSavedPackages = () => {
  return new Promise((resolve, error) => {
    open(filePath, 'r', (err, fileDescriptor) => {
      if (err) {
        if (err.code === 'ENOENT') {
          return resolve([]);
        }

        return error(err);
      }

      readFile(fileDescriptor, (err, contents) => {
        const packageVersionJsonList = JSON.parse(contents);
        const packageVersions = [];
        packageVersionJsonList.forEach(packageVersionJson =>
          packageVersions.push(PackageVersion.createFromJson(packageVersionJson))
        );

        return resolve(packageVersions);
      });
    });
  });
};

exports.setSavedPackages = packagesToStore => {
  return new Promise((resolve, error) => {
    if (!packagesToStore || packagesToStore.length === 0) {
      return resolve();
    }

    const contentToWrite = JSON.stringify(packagesToStore);

    writeFile(filePath, contentToWrite, err => {
      if (err) {
        return error(err);
      }

      return resolve();
    });
  });
};
