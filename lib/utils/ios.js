const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const { createDirectory, warn } = require('../../utils/index');

const iosDefaultIconName = 'Icon-App';

const getIosDefaultIconFolder = (projectName) => `ios/${projectName}/Images.xcassets/AppIcon.appiconset/`;
const getIosConfigFile = (projectName) => `ios/${projectName}.xcodeproj/project.pbxproj`;
const getIosAssetFolder = (projectName) => `ios/${projectName}/Images.xcassets/`;

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

exports.createIosIcons = (imagePath, ios, flavor, context) => {
  return new Promise((resolve, reject) => {
    const projectName = getProjectName(context);

    if (!projectName) {
      return reject('No Project Directory for IOS was found');
    }

    fs.readFile(imagePath, async (err, image) => {
      if (err) {
        return reject(err);
      }

      let iconName, catalogName = 'AppIcon';

      if (flavor) {
        catalogName = `AppIcon-${flavor}`;

        iconName = iosDefaultIconName;
      } else if (typeof ios === 'string') {
        iconName = ios;
        catalogName = iconName;
      } else {
        iconName = iosDefaultIconName;
      }

      for (const iosIcon of iosIcons) {
        await saveIcon(image, getIosDefaultIconFolder(projectName), iconName, iosIcon);
      }

      await changeIosLauncherIcon(catalogName, context, projectName);

      modifyContentsFile(catalogName, iconName, projectName);

      resolve();
    });
  });
};

const getProjectName = (context) => {
  const appFilePath = path.resolve(context, 'app.json');

  if (fs.existsSync(appFilePath)) {
    const app = require(appFilePath);

    if (typeof app === 'object' && app.name) {
      return app.name;
    }
  }

  const iosDirectory = path.resolve(context, 'ios');

  const directories = fs.readdirSync(iosDirectory, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  for (const dir of directories) {
    const subdirs = fs.readdirSync(path.resolve(iosDirectory, dir), { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    const index = subdirs.indexOf('Images.xcassets');

    if (index + 1) {
      return dir;
    }
  }

  return 'AppName';
};

const changeIosLauncherIcon = (iconName, context, projectName) => {
  return new Promise((resolve, reject) => {
    const iOSconfigFile = path.resolve(context, getIosConfigFile(projectName));

    fs.readFile(iOSconfigFile, 'utf-8', (err, config) => {
      if (err) {
        if (err.code === 'ENOENT') {
          warn('No project.pbxproj was found, icon can\'t be replaced in config file. Skipped');

          return resolve();
        }

        return reject(err);
      }

      const lines = config.split('\n');

      let currentConfig, onConfigurationSection = false;

      for (let i = 0; i <= lines.length - 1; i++) {
        const line = lines[i];

        if (line.includes('/* Begin XCBuildConfiguration section */')) {
          onConfigurationSection = true;
        }

        if (line.includes('/* End XCBuildConfiguration section */')) {
          onConfigurationSection = false;
        }

        if (onConfigurationSection) {
          const regex = /.*\/* (.*)\.xcconfig \*\/;/;
          const match = regex.exec(line);

          if (match) {
            currentConfig = match[1];
          }

          if (currentConfig && line.includes('ASSETCATALOG')) {
            lines[i] = line.replaceAll(/=(.*);/g, `= ${iconName};`);
          }
        }
      }

      const entireFile = lines.join('\n');
      resolve(fs.writeFileSync(iOSconfigFile, entireFile));
    });
  });
};

const modifyContentsFile = (newCatalogName, newIconName, projectName) => {
  const newIconDirectory = path.resolve(getIosAssetFolder(projectName), newCatalogName + '.appiconset/Contents.json');

  createDirectory(path.dirname(newIconDirectory));

  const contentsFileContent = generateContentsFile(newIconName);

  fs.writeFileSync(newIconDirectory, JSON.stringify(contentsFileContent, null, 2));
};

const generateContentsFile = (newIconName) => ({
  images: createImageList(newIconName),
  info: { version: 1, author: 'xcode' },
});

const createImageList = (newIconName) => {
  return [
    {
      size: '20x20',
      idiom: 'iphone',
      filename: `${newIconName}-20x20@2x.png`,
      scale: '2x'
    },
    {
      size: '20x20',
      idiom: 'iphone',
      filename: `${newIconName}-20x20@3x.png`,
      scale: '3x'
    },
    {
      size: '29x29',
      idiom: 'iphone',
      filename: `${newIconName}-29x29@1x.png`,
      scale: '1x'
    },
    {
      size: '29x29',
      idiom: 'iphone',
      filename: `${newIconName}-29x29@2x.png`,
      scale: '2x'
    },
    {
      size: '29x29',
      idiom: 'iphone',
      filename: `${newIconName}-29x29@3x.png`,
      scale: '3x'
    },
    {
      size: '40x40',
      idiom: 'iphone',
      filename: `${newIconName}-40x40@2x.png`,
      scale: '2x'
    },
    {
      size: '40x40',
      idiom: 'iphone',
      filename: `${newIconName}-40x40@3x.png`,
      scale: '3x'
    },
    {
      size: '60x60',
      idiom: 'iphone',
      filename: `${newIconName}-60x60@2x.png`,
      scale: '2x'
    },
    {
      size: '60x60',
      idiom: 'iphone',
      filename: `${newIconName}-60x60@3x.png`,
      scale: '3x'
    },
    {
      size: '20x20',
      idiom: 'ipad',
      filename: `${newIconName}-20x20@1x.png`,
      scale: '1x'
    },
    {
      size: '20x20',
      idiom: 'ipad',
      filename: `${newIconName}-20x20@2x.png`,
      scale: '2x'
    },
    {
      size: '29x29',
      idiom: 'ipad',
      filename: `${newIconName}-29x29@1x.png`,
      scale: '1x'
    },
    {
      size: '29x29',
      idiom: 'ipad',
      filename: `${newIconName}-29x29@2x.png`,
      scale: '2x'
    },
    {
      size: '40x40',
      idiom: 'ipad',
      filename: `${newIconName}-40x40@1x.png`,
      scale: '1x'
    },
    {
      size: '40x40',
      idiom: 'ipad',
      filename: `${newIconName}-40x40@2x.png`,
      scale: '2x'
    },
    {
      size: '76x76',
      idiom: 'ipad',
      filename: `${newIconName}-76x76@1x.png`,
      scale: '1x'
    },
    {
      size: '76x76',
      idiom: 'ipad',
      filename: `${newIconName}-76x76@2x.png`,
      scale: '2x'
    },
    {
      size: '83.5x83.5',
      idiom: 'ipad',
      filename: `${newIconName}-83.5x83.5@2x.png`,
      scale: '2x'
    },
    {
      size: '1024x1024',
      idiom: 'ios-marketing',
      filename: `${newIconName}-1024x1024@1x.png`,
      scale: '1x'
    }
  ];
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

exports.getProjectName = getProjectName;
exports.changeIosLauncherIcon = changeIosLauncherIcon;
