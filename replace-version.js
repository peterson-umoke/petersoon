var replace = require('replace-in-file');
var package = require('./package.json');

var buildVersion = package.version;
const options = {
  files: [
    'apps/Marketplace/src/environments/environment.prod.ts',
    'apps/Marketplace/src/environments/environment.prod-ca.ts',
  ],
  from: /version: '(.*)'/g,
  to: "version: '" + buildVersion + "'",
  allowEmptyPaths: false,
};

try {
  const changedFiles = replace.sync(options);
  if (changedFiles == 0) {
    throw "Please make sure that file '" +
      options.files +
      "' has \"version: ''\"";
  }
  console.log('Build version set: ' + buildVersion);
} catch (error) {
  console.error('Error occurred:', error);
  throw error;
}
