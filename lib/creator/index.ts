import path from 'path';
import { resolveConfig, error, info, log } from '../../utils/index';

import IOSIconCreator from './ios';
import AndroidIconCreator from './android';

interface creatorOptions {
  imagePath?: string;
  android?: boolean | string;
  ios?: boolean | string;
  imagePathAndroid?: string;
  imagePathIos?: string;
  flavor?: string;
  adaptiveIconBackground?: string;
  adaptiveIconForeground?: string;
  group?: string;
  disableLauncherIcon?: boolean;
};

export default class Creator {
  options: creatorOptions;
  context: string;

  constructor(opts: creatorOptions) {
    const context = process.cwd();

    const config = resolveConfig(context);

    if (!opts.imagePath) {
      opts.imagePath = config.imagePath;
    }

    const options = {
      ...config,
      ...opts
    };

    // both android and ios are included by default
    if (!options.android && !options.ios) {
      options.android = true;
      options.ios = true;
    }

    this.context = context;
    this.options = options;

    this.resovleOptionPaths();
  }

  resovleOptionPaths() {
    const context = process.cwd();

    const options = this.options;

    const paths = [
      'imagePath',
      'imagePathIos',
      'imagePathAndroid',
      'adaptiveIconBackground',
      'adaptiveIconForeground',
    ] as const;

    for (const prop of paths) {
      if (typeof options[prop] !== 'undefined') {
        if (!options[prop]!.match(/^#[0-9A-Za-z]{6}$/)) {
          options[prop] = path.resolve(context, options[prop]!);
        }
      }
    }
  }

  async run() {
    const options = this.options;

    const context = this.context;

    if (options.android) {
      info('Creating icons for Android...');

      const imagePathAndroid = options.imagePathAndroid || options.imagePath;

      if (!imagePathAndroid) {
        return error('No image path was specified for android');
      }

      const androidIconCreator = new AndroidIconCreator(context, {
        flavor: options.flavor,
        android: options.android,
        disableLauncherIcon: options.disableLauncherIcon,
      });

      await androidIconCreator.createAndroidIcons(imagePathAndroid);

      const { adaptiveIconBackground, adaptiveIconForeground } = options;

      if (adaptiveIconBackground && adaptiveIconForeground) {
        await androidIconCreator.createAdaptiveIcons(adaptiveIconBackground, adaptiveIconForeground);
      }
    }

    if (options.ios) {
      info('Creating icons for IOS...');

      const iOSIconCreator = new IOSIconCreator(context, {
        ios: options.ios,
        flavor: options.flavor,
        group: options.group,
        disableLauncherIcon: options.disableLauncherIcon,
      });

      const imagePathIos = options.imagePathIos || options.imagePath;

      if (!imagePathIos) {
        return error('No image path was specified for iOS');
      }

      await iOSIconCreator.createIosIcons(imagePathIos!);
    }

    log();
    log('🎉  Successfully generated icons.');
  }
}
