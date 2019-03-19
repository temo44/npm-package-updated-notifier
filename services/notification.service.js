const notifier = require('node-notifier');

exports.showNotificationForPackages = packages => {
  const messages = packages.map(
    packageVersion => `${packageVersion.name} is updated to ${packageVersion.version}`
  );

  notifier.notify({
    title: 'Updated npm packages!',
    message: messages.join('\n')
  });

  return packages;
};
