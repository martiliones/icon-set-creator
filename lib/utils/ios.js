const fs = require('fs');
const sharp = require('sharp');

const iosDefaultIconFolder = 'ios/Runner/Assets.xcassets/AppIcon.appiconset/';
const iosDefaultIconName = 'Icon-App';

const iosIcons = [
  { name: '-20x20@1x', size: 20 },
  { name: '-20x20@2x', size: 40 },
  { name: '-20x20@3x', size: 60 },
  { name: '-29x29@1x', size: 29 },
  { name: '-29x29@2x', size: 58 },
  { name: '-29x29@3x', size: 87 },
  { name: '-40x40@1x', size: 40 },
  { name: '-40x40@2x', size: 80 },
  { name: '-40x40@3x', size: 120 },
  { name: '-60x60@2x', size: 120 },
  { name: '-60x60@3x', size: 180 },
  { name: '-76x76@1x', size: 76 },
  { name: '-76x76@2x', size: 152 },
  { name: '-83.5x83.5@2x', size: 167 },
  { name: '-1024x1024@1x', size: 1024 },
];

exports.createIosIcons = (imagePath, ios, flavor) => {
  return new Promise((resolve, reject) => {
    fs.readFile(imagePath, async (err, image) => {
      if (err) {
        return reject(err);
      }

      let iconName, catalogName = 'AppIcon';

      if (flavor) {
        catalogName = `AppIcon-${flavor}`;

        modifyContentsFile(catalogName);

        iconName = iosDefaultIconName;
      } else if (typeof ios === 'string') {
        iconName = ios;
        catalogName = iconName;
      } else {
        iconName = iosDefaultIconName;
      }

      for (const iosIcon of iosIcons) {
        await saveIcon(image, iosDefaultIconFolder, iconName, iosIcon);
      }

      changeIosLauncherIcon(catalogName, flavor);

      if (catalogName !== 'AppIcon') {
        modifyContentsFile(iconName);
      }
    });
  });
};

const saveIcon = (image, iconDirectory, iconName, iosIcon) => {
  return new Promise((resolve, reject) => {
    createDirectory(iconDirectory);

    sharp(image)
      .resize(iosIcon.size, iosIcon.size)
      // Icons with alpha channel are not allowed in the Apple App Store
      .removeAlpha()
      .toFile(path.resolve(iconDirectory, `${iconName + iosIcon.name}.png`), (err, data) => {
        if (err) {
          return reject(err);
        }

        resolve(data);
      });
  });
};
