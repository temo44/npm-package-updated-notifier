const { exec } = require('child_process');

class PackageVersion {
  constructor(name, version) {
    this.name = name;
    this.version = version;
  }

  static createFromJson(json) {
    return new PackageVersion(json.name, json.version);
  }
}

exports.PackageVersion = PackageVersion;

exports.getLatestVersionByNames = packageNames => {
  let updatedPackagesPromises = [];
  packageNames.forEach(packageName => {
    updatedPackagesPromises.push(exports.getLatestVersionByName(packageName));
  });

  return Promise.all(updatedPackagesPromises);
};

exports.getLatestVersionByName = packageName => {
  return new Promise((resolve, error) => {
    exec(`npm show ${packageName} version`, (err, stdout, stderr) => {
      if (err) {
        return error(err);
      }

      if (stderr) {
        return error(stderr);
      }

      return resolve(new PackageVersion(packageName, stdout.trim()));
    });
  });
};

exports.getOnlyPackagesThatAreUpdatedFrom = (packagesFromNpm, packagesFromFile) => {
  const updatedPackages = [];

  packagesFromNpm.forEach(packageFromNpm => {
    const packageFromFile = packagesFromFile.find(
      packageFile => packageFile.name === packageFromNpm.name
    );

    if (!packageFromFile || packageFromNpm.version !== packageFromFile.version) {
      updatedPackages.push(packageFromNpm);
    }
  });

  return updatedPackages;
};
