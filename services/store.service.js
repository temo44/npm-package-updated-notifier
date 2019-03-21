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

exports.setSavedPackages = updatedPackages => {
  return new Promise((resolve, error) => {
    if (!updatedPackages || updatedPackages.length === 0) {
      return resolve();
    }

    exports.getSavedPackages().then(localPackages => {
      const packagesToStore = mergeLocalPackagesWithUpdatedPackages(localPackages, updatedPackages);

      const contentToWrite = JSON.stringify(packagesToStore);

      writeFile(filePath, contentToWrite, err => {
        if (err) {
          return error(err);
        }

        return resolve();
      });
    });
  });
};

function mergeLocalPackagesWithUpdatedPackages(localPackages, updatedPackages) {
  updatedPackages.forEach(packageToStore => {
    const existingPackage = localPackages.find(
      localPackage => localPackage.name === packageToStore.name
    );

    if (existingPackage) {
      existingPackage.version = packageToStore.version;
    } else {
      localPackages.push(packageToStore);
    }
  });

  return localPackages;
}
