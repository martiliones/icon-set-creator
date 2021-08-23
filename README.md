<header>
<p align="center">
  <img src="assets/iphone.svg" alt="logo" width="400">
</p>
<h1 align="center">
Icon Set Creator
</h1>
<p align="center">
<a href="https://www.npmjs.com/package/icon-set-creator" target="__blank"><img src="https://img.shields.io/npm/v/icon-set-creator?color=7DE1D1&label=" alt="NPM version"></a>
<a href="https://www.npmjs.com/package/icon-set-creator" target="__blank"><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/icon-set-creator?color=6AC704&label="></a>
<a href="https://github.com/martiliones/icon-set-creator" target="__blank"><img src="https://img.shields.io/github/license/martiliones/icon-set-creator.svg?label=&message=themes&color=FFB706" alt="License"></a>
<img src="https://img.shields.io/codecov/c/github/martiliones/icon-set-creator?color=FF4F4D&logoColor=FF4F4D" alt="Code Coverage">
<a href="https://github.com/martiliones/icon-set-creator" target="__blank"><img alt="GitHub stars" src="https://img.shields.io/github/stars/martiliones/icon-set-creator?style=social"></a>
</p>
</header>

- 🌈 <b>Easy to install</b> — does not require additional programs
- ⚡️ <b>Fast</b> — image manipulation powered by [sharp](https://www.npmjs.com/package/sharp)
- 🛠 <b>Configurable</b> — using cli options or config file
- 🌟 <b>Adaptive Icons</b> — support for color and image backgrounds
- 📱 <b>iOS and Android support</b> — create icons for both platforms with one command

<h2>🚀 Installation</h2>
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

If you want to install the icon-set-creator **locally**, use one of the following commands:

```bash
$ npm install icon-set-creator -D
# OR
$ yarn add icon-set-creator -D
```

<h2>🧪 Usage</h2>

The easiest way to use `icon-set-creator` is to specify the path to icon using `iconset create` command in root of your project:
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

There are two ways you can configure `icon-set-creator`. The first with the cli parameters, and the second is through the config file `iconset.config.js` or `package.json` depending on your code style.

<h3>Config options</h3>

- `imagePath` — The location of the icon image file which you want to use as the app launcher icon. e.g. `./assets/icon.png`
- `android`/`ios` (optional): `true` — Override the default existing Flutter launcher icon for the platform specified, `false` — ignore making launcher icons for this platform, `icon_name` — this will generate a new launcher icons for the platform with the name you specify, without removing the old default existing Flutter launcher icon.
- `imagePathAndroid` — The location of the icon image file specific for Android platform (optional — if not defined then the `imagePath` is used)
- `imagePathIos` — The location of the icon image file specific for iOS platform (optional — if not defined then the `imagePath` is used)

The next two attributes are only used when generating Android launcher icon:

- `adaptiveIconBackground` — The color (E.g. `"#ffffff"`) or image asset (E.g. `"assets/images/dark-background.png"`) which will be used to fill out the background of the adaptive icon
- `adaptiveIconForeground` — The image asset which will be used for the icon foreground of the adaptive icon


<h3>CLI options</h3>

```bash
Usage: iconset create [options] [image-path]

Generate a new icon set for React Native project

Options:
  -A, --android [icon-name]                    Generate icon set for android
  -IPA, --image-path-android                   Image path for android
  -b, --adaptive-icon-background <background>  The color (E.g. "#ffffff") or image asset (E.g. "assets/images/christmas-background.png") which will be used to fill
                                               out the background of the adaptive icon.
  -f, --adaptive-icon-foreground <foreground>  The image asset which will be used for the icon foreground of the adaptive icon
  -I, --ios                                    Generate icon set for ios
  -IPI, --image-path-ios                       Image path for ios
  -h, --help                                   display help for command
```

<h2>👀 Example</h2>

You can check the [`example`](https://github.com/martiliones/icon-set-creator/tree/master/example) folder for example icons and [this guide on Medium](https://medium.com/@martiliones/the-easiest-way-to-create-and-manage-app-icons-for-react-native-on-ios-android-41ccca39df2).

<h1></h1>

<p align="center">✨ You are amazing!</p>
