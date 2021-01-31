module.exports = {
  name: 'Marketplace',

  preset: '../../jest.config.js',

  coverageDirectory: '../../coverage/apps/Marketplace',

  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',

    'jest-preset-angular/build/AngularSnapshotSerializer.js',

    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
