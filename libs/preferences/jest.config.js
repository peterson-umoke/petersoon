module.exports = {
  name: 'preferences',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/preferences',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
