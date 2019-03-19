const npmService = require('./services/npm.service');
const storeService = require('./services/store.service');
const notificationService = require('./services/notification.service');

const packagesToWatch = ['@angular/core', 'cordova-plugin-firebase-messaging'];

npmService
  .getLatestVersionByNames(packagesToWatch)
  .then(packagesFromNpm => {
    return storeService.getSavedPackages().then(packagesFromFile => {
      return npmService.getOnlyPackagesThatAreUpdatedFrom(packagesFromNpm, packagesFromFile);
    });
  })
  .then(notificationService.showNotificationForPackages)
  .then(storeService.setSavedPackages);
