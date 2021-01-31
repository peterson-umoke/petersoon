module.exports = {
  name: 'campaigns',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/campaigns',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
