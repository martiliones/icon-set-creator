import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

import { log, warn, createDirectory } from '../../utils/index';

import {
  getAndroidResDirectory,
  getAndroidAdaptiveXmlFolder,
  getAndroidColorsFile,
  isAndroidIconNameCorrectFormat,
  getIcLauncherDrawableBackgroundXml,
  getIcLauncherXml,
  getColorsXmlTemplate,
  getRoundedCornersLayer,
  androidIcons,
  adaptiveAndroidIcons,
  androidManifestFile,
  androidAdaptiveForegroundFileName,
  androidAdaptiveBackgroundFileName,
  AndroidIcon,
} from '../utils/android';

interface AndroidCreatorOptions {
  flavor?: string;
  android?: any;
}

class AndroidIconCreator {
  context: string;
  options: AndroidCreatorOptions;

  constructor(context: string, opts: AndroidCreatorOptions) {
    this.context = context;
    this.options = opts;

    if (typeof opts.android === 'string') {
      if (!isAndroidIconNameCorrectFormat(opts.android)) {
        throw new Error('The icon name must contain only lowercase a-z, 0-9, or underscore: \nE.g. "ic_my_new_icon"');
      }
    }
  }

  createAndroidIcons(imagePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const androidResDirectory = path.resolve(this.context, getAndroidResDirectory(this.options.flavor));

      let iconName = this.options.android;

      if (typeof iconName === 'string') {
        log('🚀 Adding a new Android launcher icon');
      } else {
        iconName = 'ic_launcher';

        log('Overwriting the default Android launcher icon with a new icon');
      }

      fs.readFile(imagePath, async (err, image) => {
        if (err) {
          return reject(err);
        }

        await this.overwriteAndroidManifestIcon(iconName!);

        for (const androidIcon of androidIcons) {
          const iconDirectory = path.resolve(androidResDirectory, androidIcon.directoryName);

          await this.saveIcon(image, iconDirectory, iconName, androidIcon);
          await this.saveRoundedIcon(image, iconDirectory, iconName, androidIcon);
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

  createAdaptiveIcons(adaptiveIconBackground: string, adaptiveIconForeground: string): Promise<void> {
    const { flavor, android } = this.options;

    return new Promise((resolve, reject) => {
      fs.readFile(path.resolve(this.context, adaptiveIconForeground), async (err, foreground) => {
        if (err) {
          return reject(err);
        }

        const androidResDirectory = path.resolve(this.context, getAndroidResDirectory(flavor));

        const foregroundIconName = typeof android === 'string'
          ? `${android}_foreground` : androidAdaptiveForegroundFileName;

        for (const adaptiveIcon of adaptiveAndroidIcons) {
          const iconDirectory = path.resolve(androidResDirectory, adaptiveIcon.directoryName);

          await this.saveIcon(foreground, iconDirectory, foregroundIconName, adaptiveIcon);
        }

        if (path.extname(adaptiveIconBackground) === '.png') {
          await this.createAdaptiveBackgrounds(adaptiveIconBackground, androidResDirectory);
        } else {
          await this.createAdaptiveIconMipmapXmlFile();
          await this.updateColorsXmlFile(adaptiveIconBackground);
        }

        resolve();
      });
    });
  }

  saveRoundedIcon(image: Buffer, iconDirectory: string, iconName: string, androidIcon: AndroidIcon) {
    const roundIconName = `${iconName}_round`;
    const { size } = androidIcon;

    return new Promise((resolve, reject) => {
      sharp(image)
        .resize(size, size)
        .composite([{
          input: getRoundedCornersLayer(size),
          blend: 'dest-in'
        }])
        .toFile(path.resolve(iconDirectory, `${roundIconName}.png`), (err, info) => {
          if (err) {
            return reject(err);
          }

          resolve(info);
        });
    });
  }

  saveIcon(image: Buffer, iconDirectory: string, iconName: string, androidIcon: AndroidIcon) {
    return new Promise((resolve, reject) => {
      createDirectory(iconDirectory);

      sharp(image)
        .resize(androidIcon.size, androidIcon.size)
        .toFile(path.resolve(iconDirectory, `${iconName}.png`), (err, info) => {
          if (err) {
            return reject(err);
          }

          resolve(info);
        });
    });
  }

  updateColorsXmlFile(adaptiveIconBackground: string) {
    const { flavor } = this.options;

    return new Promise((resolve) => {
      const colorsXml = path.resolve(this.context, getAndroidColorsFile(flavor));

      if (fs.existsSync(colorsXml)) {
        log('📄 Updating colors.xml with color for adaptive icon background');

        resolve(this.updateColorsFile(colorsXml, adaptiveIconBackground));
      } else {
        log('⚠️ No colors.xml file found in your Android project');
        log('Creating colors.xml file and adding it to your Android project');

        resolve(this.createNewColorsFile(adaptiveIconBackground));
      }
    });
  }

  updateColorsFile(colorsXml: string, adaptiveIconBackground: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.readFile(colorsXml, 'utf-8', (err, colors) => {
        if (err) {
          return reject(err);
        }

        const lines = colors.split('\n');

        let foundExisting = false;

        for (let i = 0; i < lines.length; i++) {
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
  }

  createNewColorsFile(adaptiveIconBackground: string) {
    return new Promise((resolve) => {
      const colorsXml = path.resolve(this.context, getAndroidColorsFile(this.options.flavor));

      createDirectory(path.dirname(colorsXml));

      const { android } = this.options;

      const iconName = typeof android === 'string'
        ? android : 'ic_launcher';

      fs.writeFileSync(colorsXml, getColorsXmlTemplate(iconName));

      resolve(this.updateColorsFile(colorsXml, adaptiveIconBackground));
    });
  }

  createAdaptiveIconMipmapXmlFile(): Promise<void> {
    const { android, flavor } = this.options;

    return new Promise((resolve, reject) => {
      const iconName = typeof android === 'string'
        ? android : 'ic_launcher';
      const iconFileName = `${iconName}.xml`;

      const directory = path.resolve(this.context, getAndroidAdaptiveXmlFolder(flavor));

      createDirectory(directory);

      fs.writeFile(path.resolve(directory, iconFileName), getIcLauncherXml(iconName), (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  }

  createAdaptiveBackgrounds(adaptiveIconBackground: string, androidResDirectory: string): Promise<void> {
    const { android, flavor } = this.options;

    const adaptiveIconBackgroundPath = path.resolve(this.context, adaptiveIconBackground);

    return new Promise((resolve, reject) => {
      fs.readFile(adaptiveIconBackgroundPath, async (err, background) => {
        if (err) {
          return reject(err);
        }

        const backgroundIconName = typeof android === 'string'
          ? `${android}_background` : androidAdaptiveBackgroundFileName;

        for (const adaptiveIcon of adaptiveAndroidIcons) {
          const iconDirectory = path.resolve(androidResDirectory, adaptiveIcon.directoryName);

          await this.saveIcon(background, iconDirectory, backgroundIconName, adaptiveIcon);
        }

        const iconName = typeof android === 'string'
          ? android : 'ic_launcher';

        const directory = path.resolve(this.context, getAndroidAdaptiveXmlFolder(flavor));

        createDirectory(directory);

        fs.writeFile(path.resolve(directory, `${iconName}.xml`), getIcLauncherDrawableBackgroundXml(iconName), (err) => {
          if (err) {
            return reject(err);
          }

          resolve();
        });
      });
    });
  }

  overwriteAndroidManifestIcon(iconName: string): Promise<void> {
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

        const newManifest = this.transformAndroidManifestIcon(manifest, iconName);

        fs.writeFile(androidManifestFile, newManifest, (err) => {
          if (err) {
            return reject(err);
          }

          resolve();
        });
      });
    });
  }

  transformAndroidManifestIcon(oldManifest: string, iconName: string) {
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
      } else if (line.includes('android:roundIcon')) {
        return line.replace(/android:icon="[^"]*(\\"[^"]*)*"/g,
          `android:roundIcon="@mipmap/${iconName}_round"`);
      } else {
        return line;
      }
    }).join('\n');
  }
}

export default AndroidIconCreator;
