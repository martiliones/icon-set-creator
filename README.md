<br>
<header>
<p align="center">
  <img src="assets/logo.svg" alt="logo" height="120">
</p>
<h1 align="center">Icon Set Creator</h1>
</header>

To install the new package, use one of the following commands. You need administrator privileges to execute these unless npm was installed on your system through a Node.js version manager (e.g. n or nvm).

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

### iconset create

```bash
Usage: iconset create [options] [image-path]

generate a new icon set for React Native project

Options:
  -A, --android [icon-name]                    generate icon set for android
  -I, --ios                                    generate icon set for ios
  -b, --adaptive-icon-background <background>  The color (E.g. "#ffffff") or image asset (E.g. "assets/images/christmas-background.png") which will be used to fill
                                               out the background of the adaptive icon.
  -f, --adaptive-icon-foreground <foreground>  The image asset which will be used for the icon foreground of the adaptive icon
  -h, --help                                   display help for command
```


