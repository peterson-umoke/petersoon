module.exports = {
  name: 'ads',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/ads',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
