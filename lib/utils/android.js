const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const { createDirectory, log, warn } = require('../../utils/index');

const androidManifestFile = 'android/app/src/main/AndroidManifest.xml';

const getAndroidResDirectory = (flavor) => `android/app/src/${flavor ?? 'main'}/res/`;
const getAndroidAdaptiveXmlFolder = (flavor) => `${getAndroidResDirectory(flavor)}mipmap-anydpi-v26/`;
const getAndroidColorsFile = (flavor) => `${getAndroidResDirectory(flavor)}res/values/colors.xml`;

const androidRoundIcon = 'ic_launcher_round';
const androidAdaptiveForegroundFileName = 'ic_launcher_foreground';
const androidAdaptiveBackgroundFileName = 'ic_launcher_background';
const androidIconNames = ['ic_launcher', androidRoundIcon];

const adaptiveForegroundIcons = [
  { directoryName: 'drawable-mdpi', size: 108 },
  { directoryName: 'drawable-hdpi', size: 162 },
  { directoryName: 'drawable-xhdpi', size: 216 },
  { directoryName: 'drawable-xxhdpi', size: 324 },
  { directoryName: 'drawable-xxxhdpi', size: 432 },
];

const androidIcons = [
  { directoryName: 'mipmap-mdpi', size: 48 },
  { directoryName: 'mipmap-hdpi', size: 72 },
  { directoryName: 'mipmap-xhdpi', size: 96 },
  { directoryName: 'mipmap-xxhdpi', size: 144 },
  { directoryName: 'mipmap-xxxhdpi', size: 192 },
];

const icLauncherXml = `
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
  <background android:drawable="@color/ic_launcher_background"/>
  <foreground android:drawable="@drawable/ic_launcher_foreground"/>
</adaptive-icon>
`;

const icLauncherDrawableBackgroundXml = `
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
  <background android:drawable="@drawable/ic_launcher_background"/>
  <foreground android:drawable="@drawable/ic_launcher_foreground"/>
</adaptive-icon>
`;

const colorsXmlTemplate = `
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#FF000000</color>
</resources>
`;

exports.createAndroidIcons = (imagePath, flavor, context) => {
  return new Promise((resolve, reject) => {
    const androidResDirectory = path.resolve(context, getAndroidResDirectory(flavor));
    fs.readFile(imagePath, async (err, image) => {
      if (err) {
        return reject(err);
      }

      for (const androidIconName of androidIconNames) {
        for (const androidIcon of androidIcons) {
          const iconDirectory = path.resolve(androidResDirectory, androidIcon.directoryName);
          await saveIcon(image, iconDirectory, androidIconName, androidIcon);
        }
      }

      sharp(image)
          .resize(512, 512)
          .toFile(path.resolve(androidResDirectory, 'playstore-icon.png'), (err) => {
            if (err) {
              return reject(err);
            }

            resolve();
          });
    });
  });
};

exports.createAdaptiveIcons = ({
  android,
  adaptiveIconBackground,
  adaptiveIconForeground
}, context, flavor) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(context, adaptiveIconForeground), async (err, foreground) => {
      if (err) {
        return reject(err);
      }

      const androidResDirectory = path.resolve(context, getAndroidResDirectory(flavor));

      for (const adaptiveIcon of adaptiveForegroundIcons) {
        const iconDirectory = path.resolve(androidResDirectory, adaptiveIcon.directoryName);

        await saveIcon(foreground, iconDirectory, androidAdaptiveForegroundFileName, adaptiveIcon);
      }

      if (path.extname(adaptiveIconBackground) === '.png') {
        await createAdaptiveBackgrounds(path.resolve(context, adaptiveIconBackground), androidResDirectory, android, flavor, context);
      } else {
        await createAdaptiveIconMipmapXmlFile(android, flavor, context);
        await updateColorsXmlFile(adaptiveIconBackground, flavor, context);
      }

      resolve();
    });
  });
};

const updateColorsXmlFile = (adaptiveIconBackground, flavor, context) => {
  return new Promise((resolve) => {
    const colorsXml = path.resolve(context, getAndroidColorsFile(flavor));

    if (fs.existsSync(colorsXml)) {
      log('📄 Updating colors.xml with color for adaptive icon background');

      resolve(updateColorsFile(colorsXml, adaptiveIconBackground));
    } else {
      log('⚠️ No colors.xml file found in your Android project');
      log('Creating colors.xml file and adding it to your Android project');

      resolve(createNewColorsFile(adaptiveIconBackground, flavor));
    }
  });
};

const createNewColorsFile = (adaptiveIconBackground, flavor, context) => {
  return new Promise((resolve) => {
    const colorsXml = path.resolve(context, getAndroidColorsFile(flavor));

    createDirectory(path.dirname(colorsXml));

    fs.writeFileSync(colorsXml, colorsXmlTemplate);

    resolve(updateColorsFile(colorsXml, adaptiveIconBackground));
  });
};

const updateColorsFile = (colorsXml, adaptiveIconBackground) => {
  return new Promise((resolve, reject) => {
    fs.readFile(colorsXml, 'utf-8', (err, colors) => {
      if (err) {
        return reject(err);
      }

      const lines = colors.split('\n');

      let foundExisting = false;

      for (let i = 0; i <= lines.length; i++) {
        const line = lines[i];

        if (line.includes('name="ic_launcher_background"')) {
          foundExisting = true;
          // replace anything between tags which does not contain another tag
          lines[i] = line.replace(/>([^><]*)</g, `>${adaptiveIconBackground}<`);

          break;
        }
      }

      if (!foundExisting) {
        lines.splice(lines.length - 1, 0,
            `\t<color name="ic_launcher_background">${adaptiveIconBackground}</color>`);
      }

      fs.writeFileSync(colorsXml, lines.join('\n'));

      resolve();
    });
  });
};

const createAdaptiveIconMipmapXmlFile = (android, flavor, context) => {
  return new Promise((resolve, reject) => {
    const iconName = typeof android === 'string'
        ? `${android}.xml` : 'ic_launcher.xml';

    const directory = path.resolve(context, getAndroidAdaptiveXmlFolder(flavor));

    createDirectory(directory);

    fs.writeFile(path.resolve(directory, iconName), icLauncherXml, (err) => {
      if (err) {
        return reject(err);
      }

      resolve();
    });
  });
};

const createAdaptiveBackgrounds = (adaptiveIconBackgroundPath, androidResDirectory, android, flavor, context) => {
  return new Promise((resolve, reject) => {
    fs.readFile(adaptiveIconBackgroundPath, async (err, background) => {
      if (err) {
        return reject(err);
      }

      for (const adaptiveIcon of adaptiveForegroundIcons) {
        const iconDirectory = path.resolve(androidResDirectory, adaptiveIcon.directoryName);

        await saveIcon(background, iconDirectory, androidAdaptiveBackgroundFileName, adaptiveIcon);
      }

      const iconName = typeof android === 'string'
          ? `${android}.xml` : 'ic_launcher.xml';

      const directory = path.resolve(context, getAndroidAdaptiveXmlFolder(flavor));

      createDirectory(directory);

      fs.writeFile(path.resolve(directory, iconName), icLauncherDrawableBackgroundXml, (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  });
};

const transformAndroidManifestIcon = (oldManifest, iconName) => {
  return oldManifest.split('\n').map((line) => {
    if (line.includes('android:icon')) {
      // Using RegExp replace the value of android:icon to point to the new icon
      // anything but a quote of any length: [^"]*
      // an escaped quote: \\" (escape slash, because it exists regex)
      // quote, no quote / quote with things behind : \"[^"]*
      // repeat as often as wanted with no quote at start: [^"]*(\"[^"]*)*
      // escaping the slash to place in string: [^"]*(\\"[^"]*)*"
      // result: any string which does only include escaped quotes
      return line.replace(/android:icon="[^"]*(\\"[^"]*)*"/g,
          `android:icon="@mipmap/${iconName}"`);
    } else {
      return line;
    }
  }).join('\n');
};

const overwriteAndroidManifestIcon = (iconName, androidManifestFile) => {
  return new Promise((resolve, reject) => {
    fs.readFile(androidManifestFile, 'utf-8', (err, manifest) => {
      if (err) {
        if (err.code === 'ENOENT') {
          warn('No AndroidManifest.xml was found, icon can\'t be replaced. Skipped');

          return resolve();
        }

        return reject(err);
      }

      log('Overwriting icon in AndroidManifest.xml');

      const newManifest = transformAndroidManifestIcon(manifest, iconName);

      fs.writeFile(androidManifestFile, newManifest, (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  });
};

const isAndroidIconNameCorrectFormat = (iconName) => {
  return /^[a-z0-9_]+$/.exec(iconName);
};

const getRectForRoundedImage = (size) => new Buffer.from(
    `<svg><rect x="0" y="0" width="${size}" height="${size}" rx="${size/2}" ry="${size/2}"/></svg>`
);

const saveIcon = (image, iconDirectory, iconName, androidIcon) => {
  return new Promise((resolve, reject) => {
    createDirectory(iconDirectory);
    const { size } = androidIcon;
    const composition = iconName === androidRoundIcon
        ? [{
          input: getRectForRoundedImage(size),
          blend: 'dest-in'
        }]
        : [];

    sharp(image)
        .resize(size)
        .composite(composition)
        .toFile(path.resolve(iconDirectory, `${iconName}.png`), (err, info) => {
          if (err) {
            return reject(err);
          }

          resolve(info);
        });
  });
};