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
  let updatedPackages = [];

  return getLatestVersionsSequentially(packageNames, 0, updatedPackages);
};

const getLatestVersionsSequentially = (packageNames, index, resultList) => {
  const packageName = packageNames[index];
  return exports.getLatestVersionByName(packageName).then(result => {
    resultList.push(result);

    if (index < packageNames.length - 1) {
      index += 1;
      return getLatestVersionsSequentially(packageNames, index, resultList);
    } else {
      return resultList;
    }
  });
};

exports.getLatestVersionByName = packageName => {
  return new Promise((resolve, error) => {
    console.log(`fetching version for ${packageName}`);
    exec(`npm view ${packageName} version`, (err, stdout, stderr) => {
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
