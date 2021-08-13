const path = require('path');
const { resolvePkg, error, info, log } = require('../utils/index');

const { createAndroidIcons, createAdaptiveIcons } = require('./utils/android');

const create = async (...args) => {
  try {
    let [imagePath, options = {}] = args;

    const context = process.cwd();

    if (!imagePath) {  
      const { iconset } = resolvePkg(context);
  
      if (!iconset || !iconset.imagePath) {
        return error('No image path was specified');
      }
  
      options = {
        android: iconset.android,
        ios: iconset.ios
      };

      imagePath = path.resolve(context, iconset.imagePath);
    }

    // both android and ios are true by default
    if (!options.android && !options.ios) {
      options = {
        ...options,
        android: true,
        ios: true
      };
    }
  
    if (options.android) {
      info('Creating default icons Android...');

      const imagePathAndroid = opts.imagePathAndroid
        ? path.resolve(context, opts.imagePathAndroid)
        : imagePath;

      await createAndroidIcons(imagePathAndroid, options.android, options.flavor);

      if (options.adaptiveIconBackground && options.adaptiveIconForeground) {
        await createAdaptiveIcons(options, context, options.flavor);
      }
    }

    if (options.ios) {
      info('Creating default icons IOS...');

      const imagePathIos = opts.imagePathIos
        ? path.resolve(context, opts.imagePathIos)
        : imagePath;

      await createIosIcons(imagePathIos, options.ios, options.flavor);
    }

    log();
    log('🎉  Successfully generated icons.');
  } catch(err) {
    console.log(err);
    error(err);
  }
};

module.exports = create;
