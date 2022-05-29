import { program } from 'commander';
import { chalk } from '.';

export default (methodName: string, log: (...args: any[]) => string) => {
  (program as any)[methodName] = function enhanceErrorMessages(...args: any[]) {
    /* eslint-disable no-underscore-dangle */
    if (methodName === 'unknownOption' && this._allowUnknownOption) {
      return;
    }

    this.outputHelp();
    console.log(`  ${chalk.red(log(...args))}`);
    console.log();

    process.exit(1);
  };
};
