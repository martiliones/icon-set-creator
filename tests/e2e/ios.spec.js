const fs = require('fs');
const path = require('path');

const { createIosIcons } = require('../../lib/utils/ios.js');

const context = path.resolve(__dirname, 'test');

test('Should create icons for iOS', async () => {
  const expected = [
    'Contents.json',
    'Icon-App-1024x1024@1x.png',
    'Icon-App-20x20@1x.png',
    'Icon-App-20x20@2x.png',
    'Icon-App-20x20@3x.png',
    'Icon-App-29x29@1x.png',
    'Icon-App-29x29@2x.png',
    'Icon-App-29x29@3x.png',
    'Icon-App-40x40@1x.png',
    'Icon-App-40x40@2x.png',
    'Icon-App-40x40@3x.png',
    'Icon-App-60x60@2x.png',
    'Icon-App-60x60@3x.png',
    'Icon-App-76x76@1x.png',
    'Icon-App-76x76@2x.png',
    'Icon-App-83.5x83.5@2x.png'
  ];

  const imagePath = path.resolve(__dirname, '../../example/icon.png');

  await createIosIcons(imagePath, true, null, context);

  const files = fs.readdirSync(path.resolve(context, 'ios', 'AppTestName', 'Images.xcassets', 'AppIcon.appiconset'));

  console.log(files);

  expect(files).toEqual(expect.arrayContaining(expected));
});
