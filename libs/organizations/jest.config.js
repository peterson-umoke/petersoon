module.exports = {
  name: 'organizations',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/organizations',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
