#!/usr/bin/env node

// Check node version before requiring/doing anything else
// The user may be on a very old node version

const { chalk, semver } = require('../utils/');
const requiredVersion = require('../package.json').engines.node;
const leven = require('leven');

const checkNodeVersion = (wanted, id) => {
  if (!semver.satisfies(process.version, wanted, { includePrerelease: true })) {
    console.log(chalk.red(
      'You are using Node ' + process.version + ', but this version of ' + id +
      ' requires Node ' + wanted + '.\nPlease upgrade your Node version.'
    ));

    process.exit(1);
  }
};

checkNodeVersion(requiredVersion, 'icon-set-creator');

const minimist = require('minimist');

const program = require('commander');

const suggestCommands = (unknownCommand) => {
  const availableCommands = program.commands.map((cmd) => cmd._name);

  let suggestion;

  availableCommands.forEach(cmd => {
    const isBestMatch = leven(cmd, unknownCommand) < leven(suggestion || '', unknownCommand);

    if (leven(cmd, unknownCommand) < 3 && isBestMatch) {
      suggestion = cmd;
    }
  });

  if (suggestion) {
    console.log('  ' + chalk.red(`Did you mean ${chalk.yellow(suggestion)}?`));
  }
};

program
  .version(`icon-set-creator ${require('../package').version}`)
  .usage('<command> [options]');

program
  .command('create [image-path]')
  .description('Generate a new icon set for React Native project')

  .option('-A, --android [icon-name]', 'Generate icon set for android')
  .option('-IPA, --image-path-android', 'Image path for android')
  .option('-b, --adaptive-icon-background <background>', 'The color (E.g. "#ffffff") or image asset (E.g. "assets/images/christmas-background.png") which will be used to fill out the background of the adaptive icon.')
  .option('-f, --adaptive-icon-foreground <foreground>', 'The image asset which will be used for the icon foreground of the adaptive icon')

  .option('-I, --ios', 'Generate icon set for ios')
  .option('-IPI, --image-path-ios', 'Image path for ios')
  .action((imagePath, options) => {
    if (minimist(process.argv.slice(3))._.length > 1) {
      console.log(chalk.yellow('\n Info: You provided more than one argument. The first one will be used as the source file, the rest are ignored.'));
    }

    require('../lib/create')(imagePath, options);
  });

program
  .command('remove')
  .description('remove a icon set from React Native project')
  .option('-A, --android', 'remove icon set for android')
  .option('-I, --ios', 'remove icon set for ios')
  .action((options) => {
    console.log(options);
    // require('../lib/remove')(options);
  });

// output help information on unknown commands
program.on('command:*', ([cmd]) => {
  program.outputHelp();

  console.log('  ' + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`));
  console.log();

  suggestCommands(cmd);

  process.exitCode = 1;
});

// add some useful info on help
program.on('--help', () => {
  console.log();
  console.log(`  Run ${chalk.cyan('iconset <command> --help')} for detailed usage of given command.`);
  console.log();
});

program.commands.forEach(c => c.on('--help', () => console.log()));

// enhance common error messages
const enhanceErrorMessages = require('../utils/enhanceErrorMessages');

enhanceErrorMessages('missingArgument', argName => {
  return `Missing required argument ${chalk.yellow(`<${argName}>`)}.`;
});

enhanceErrorMessages('unknownOption', optionName => {
  return `Unknown option ${chalk.yellow(optionName)}.`;
});

enhanceErrorMessages('optionMissingArgument', (option, flag) => {
  return `Missing required argument for option ${chalk.yellow(option.flags)}` + (
    flag ? `, got ${chalk.yellow(flag)}` : ''
  );
});

program.parse(process.argv);
