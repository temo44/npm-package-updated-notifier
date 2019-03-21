const npmService = require('./services/npm.service');
const storeService = require('./services/store.service');
const notificationService = require('./services/notification.service');

const packagesToWatch = [
  '@angular/core',
  'cordova-plugin-firebase-messaging',
  'cordova-ios',
  'cordova-android'
];

npmService
  .getLatestVersionByNames(packagesToWatch)
  .then(packagesFromNpm => {
    console.log(`Retrieved the following packages with their versions:`);
    console.log(packagesFromNpm);
    return storeService.getSavedPackages().then(packagesFromFile => {
      return npmService.getOnlyPackagesThatAreUpdatedFrom(packagesFromNpm, packagesFromFile);
    });
  })
  .then(notificationService.showNotificationForPackages)
  .then(storeService.setSavedPackages)
  .catch(error => {
    console.log(error);
    console.log('oepsie');
  });
