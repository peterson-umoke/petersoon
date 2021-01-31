module.exports = {
  name: 'reports',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/reports',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
