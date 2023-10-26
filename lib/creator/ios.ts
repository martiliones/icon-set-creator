import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

import { warn, createDirectory } from '../../utils/index';

import {
  iosDefaultIconName,
  iosDefaultCatalogName,
  getIosDefaultIconFolder,
  getIosConfigFile,
  getIosAssetFolder,
  generateContentsFile,
  iosIcons,
  IosIcon,
} from '../utils/ios';

interface IOSCreatorOptions {
  ios?: boolean | string;
  flavor?: string;
  group?: string;
  disableLauncherIcon?: boolean;
}

class IOSIconCreator {
  context: string;
  options: IOSCreatorOptions;

  constructor(context: string, opts: IOSCreatorOptions) {
    this.context = context;
    this.options = opts;
  }

  createIosIcons(imagePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const projectName = this.getIosProjectName();

      if (!projectName) {
        return reject('No Project Directory for IOS was found');
      }

      fs.readFile(imagePath, async (err, image) => {
        if (err) {
          return reject(err);
        }

        let iconName = iosDefaultIconName;
        let catalogName = iosDefaultCatalogName;

        const { flavor, ios, disableLauncherIcon } = this.options;

        if (flavor) {
          catalogName = `AppIcon-${flavor}`;

          iconName = iosDefaultIconName;
        } else if (typeof ios === 'string') {
          iconName = ios;
          catalogName = iconName;
        }

        for (const iosIcon of iosIcons) {
          const flavorPath = path.resolve(this.context, getIosDefaultIconFolder(projectName, flavor));

          await this.saveIosIcon(
            image,
            flavorPath,
            iconName,
            iosIcon
          );
        }

        if (!disableLauncherIcon) {
          await this.changeIosLauncherIcon(catalogName, projectName);
        }

        this.modifyContentsFile(catalogName, iconName, projectName);

        resolve();
      });
    });
  }

  getIosProjectName() {
    const { group } = this.options;

    if (group) {
      return group;
    }

    const appFilePath = path.resolve(this.context, 'app.json');

    if (fs.existsSync(appFilePath)) {
      const app = require(appFilePath);

      if (typeof app === 'object' && app.name) {
        return app.name;
      }
    }

    const iosDirectory = path.resolve(this.context, 'ios');

    const directories = fs.readdirSync(iosDirectory, { withFileTypes: true });

    for (const dir of directories) {
      if (!dir.isDirectory()) {
        continue;
      }

      if (fs.existsSync(path.resolve(iosDirectory, dir.name, 'Images.xcassets'))) {
        return dir.name;
      }
    }

    return 'AppName';
  }

  saveIosIcon(image: Buffer, iconDirectory: string, iconName: string, iosIcon: IosIcon) {
    return new Promise((resolve, reject) => {
      createDirectory(iconDirectory);

      sharp(image)
        .resize(iosIcon.size, iosIcon.size)
        .removeAlpha() // Icons with alpha channel are not allowed in the Apple App Store
        .toFile(path.resolve(iconDirectory, `${iconName + iosIcon.name}.png`), (err, data) => {
          if (err) {
            return reject(err);
          }

          resolve(data);
        });
    });
  }

  changeIosLauncherIcon(catalogName: string, projectName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const iOSconfigFile = path.resolve(this.context, getIosConfigFile(projectName));

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

            if (currentConfig && line.includes('ASSETCATALOG_COMPILER_APPICON_NAME')) {
              lines[i] = line.replace(/=(.*);/g, `= ${catalogName};`);
            }
          }
        }

        const entireFile = lines.join('\n');
        resolve(fs.writeFileSync(iOSconfigFile, entireFile));
      });
    });
  }

  modifyContentsFile(newCatalogName: string, newIconName: string, projectName: string) {
    const newIconDirectory = path.resolve(
      this.context,
      getIosAssetFolder(projectName),
      `${newCatalogName}.appiconset/Contents.json`
    );

    createDirectory(path.dirname(newIconDirectory));

    const contentsFileContent = generateContentsFile(newIconName);

    fs.writeFileSync(newIconDirectory, JSON.stringify(contentsFileContent, null, 2));
  }
}

export default IOSIconCreator;
