[1]: https://www.npmjs.com/package/icon-set-creator

<header>
<p align="center">
  <img src="assets/iphone.png" alt="logo" width="400">
</p>
<h1 align="center">
Icon Set Creator
</h1>
<p align="center">
Android & iOS icon generator for React Native
</p>
<p align="center">
<a href="https://www.npmjs.com/package/icon-set-creator" target="__blank"><img src="https://img.shields.io/npm/v/icon-set-creator?color=7DE1D1&label=" alt="NPM version"></a>
<a href="https://www.npmjs.com/package/icon-set-creator" target="__blank"><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/icon-set-creator?color=6AC704&label="></a>
<a href="https://github.com/martiliones/icon-set-creator" target="__blank"><img src="https://img.shields.io/github/license/martiliones/icon-set-creator.svg?label=&message=themes&color=FFB706" alt="License"></a>
<img src="https://img.shields.io/codecov/c/github/martiliones/icon-set-creator?color=FF4F4D&logoColor=FF4F4D" alt="Code Coverage">
<br>
<a href="https://github.com/martiliones/icon-set-creator" target="__blank"><img alt="GitHub stars" src="https://img.shields.io/github/stars/martiliones/icon-set-creator?style=social"></a>
</p>
</header>

- 🌈 <b>Easy to install</b> — does not require additional software
- ⚡️ <b>Fast</b> — image manipulation powered by [sharp](https://github.com/lovell/sharp)
- 🛠 <b>Configurable</b> — using cli options or config file
- 📱 <b>iOS and Android support</b> — create icons for both platforms with one command
- 🌟 <b>Adaptive Icons</b> — support for color and image backgrounds
- 🟢 <b>Round Icons</b> — automatically generated for Android

<h2>⚡️ Quick Start</h2>

You can run the icon generator with the npx command (available in Node.js 8.2.0 and later).

```bash
$ npx icon-set-creator create ./path/to/icon.png
```

For earlier Node versions, see [🚀 Installation](#-installation) section below.

<h2>🚀 Installation</h2>

> **Node Version Requirement**
>
> Icon set creator requires Node.js version 14.0 or above (v16+ recommended). You can manage multiple versions of Node on the same machine with [n](https://github.com/tj/n), [nvm](https://github.com/creationix/nvm) or [nvm-windows](https://github.com/coreybutler/nvm-windows) .

<h3>Global</h3>

To install the new package **globally**, use one of the following commands. You need administrator privileges to execute these unless npm was installed on your system through a Node.js version manager (e.g. n or nvm).

```bash
$ npm install -g icon-set-creator
# OR
$ yarn global add icon-set-creator
```

After installation, you will have access to the iconset binary in your command line. You can verify that it is properly installed by simply running `iconset`, which should present you with a help message listing all available commands.

You can check you have the right version with this command:

```bash
$ iconset --version
```

<h3>Local for a project</h3>

If you want to install the [`icon-set-creator`][1] **locally**, use one of the following commands:

```bash
$ npm install icon-set-creator -D
# OR
$ yarn add icon-set-creator -D
```

<h2>🧪 Usage</h2>

To create app icon you need:
- PNG icon for IOS and Android (Highly recommend using an icon with a size of at least 1024x1024 pixels). You can check the [`example`](https://github.com/martiliones/icon-set-creator/tree/master/example) folder for example icons.
- You can also create Adaptive Icon for Android, which can display a variety of shapes across different device models ([Learn More](https://developer.android.com/guide/practices/ui_guidelines/icon_design_adaptive)). To create it you need a foreground image and a background color or image. [There is also a good article](https://medium.com/google-design/designing-adaptive-icons-515af294c783) on how to design such icons.

The easiest way to use [`icon-set-creator`][1] is to specify the path to icon using `iconset create` command in root of your project:
```bash
$ iconset create ./icon.png
```

If you have the package installed locally, you can do same with the `package.json` script and then run it with `npm run create-appicon`:
```json5
{
  "scripts": {
    "create-appicon": "iconset create ./icon.png"
  }
}
```

It will generate icons of different sizes for Android and iOS.

<h2>⚙️ Configuration</h2>

There are two primary ways to configure [`icon-set-creator`][1]:

- **CLI parameters** - use the command options.
- **Configuration files** - use a JavaScript, JSON, or `package.json` file to specify configuration information to generate an application icon depending on your code style.

<h3> CLI parameters </h3>

To display all of the options for the given command, run `iconset <command> --help`. For example:

```bash
$ iconset create --help
```

<h3> Configuration files </h3>

[`icon-set-creator`][1] supports configuration files in several formats:

- JavaScript - use `.iconsetrc.js` and export an object containing your configuration.
- JSON - use `.iconsetrc.json` to define the configuration structure.
- `package.json` - create an `iconsetConfig` property in your package.json file and define your configuration there.

If there are multiple configuration files in the same directory, `icon-set-creator` will only use one. The priority order is as follows:

- `.iconsetrc.js`
- `.iconsetrc.json`
- `package.json`

[`icon-set-creator`][1] will automatically look for them in the directory path to be used to run the CLI.

Here's an example JavaScript configuration file that uses the `adaptiveIconBackground`/`adaptiveIconForeground` options to support adaptive icons:

```js
// .iconsetrc.js
module.exports = {
  imagePath: './assets/icon.png',

  adaptiveIconBackground: './assets/icon-background.png',
  adaptiveIconForeground: './assets/icon-foreground.png',
};
```

<h4> iconset create </h4>

- `imagePath` — The location of the icon image file which you want to use as the app launcher icon. e.g. `./assets/icon.png`
- `android`/`ios` (optional): `true` — Override the default existing React-Native launcher icon for the platform specified, `false` — ignore making launcher icons for this platform, `icon_name` — this will generate a new launcher icons for the platform with the name you specify, without removing the old default existing React-Native launcher icon.
- `imagePathAndroid` — The location of the icon image file specific for Android platform (optional — if not defined then the `imagePath` is used)
- `imagePathIos` — The location of the icon image file specific for iOS platform (optional — if not defined then the `imagePath` is used)

The next two attributes are only used when generating Android launcher icon:

- `adaptiveIconBackground` — The color (E.g. `"#ffffff"`) or image asset (E.g. `"assets/images/dark-background.png"`) which will be used to fill out the background of the adaptive icon
- `adaptiveIconForeground` — The image asset which will be used for the icon foreground of the adaptive icon

<h1></h1>

<p align="center">✨ You are amazing!</p>
