/* eslint-disable no-debugger, no-console */
const chalk = require('chalk');
const stripAnsi = require('strip-ansi');

const format = (label, msg) => msg.split('\n').map((line, i) => (
  i === 0
    ? `${label} ${line}`
    : line.padStart(stripAnsi(label).length + line.length + 1)
)).join('\n');

const chalkTag = (msg) => chalk.bgBlackBright.white.dim(` ${msg} `);

exports.log = (msg = '', tag = null) => (
  tag ? console.log(format(chalkTag(tag), msg)) : console.log(msg)
);

exports.info = (msg, tag = null) => {
  console.log(format(chalk.bgBlue.black(' INFO ') + (tag ? chalkTag(tag) : ''), msg));
};

exports.done = (msg, tag = null) => {
  console.log(format(chalk.bgGreen.black(' DONE ') + (tag ? chalkTag(tag) : ''), msg));
};

exports.warn = (msg, tag = null) => {
  console.warn(format(chalk.bgYellow.black(' WARN ') + (tag ? chalkTag(tag) : ''), chalk.yellow(msg)));
};

exports.error = (msg, tag = null) => {
  console.error(format(chalk.bgRed(' ERROR ') + (tag ? chalkTag(tag) : ''), chalk.red(msg)));
};
