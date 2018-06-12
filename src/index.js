// @flow

import chalk from 'chalk';

import interpret from './Interpreter';

const repl = require('repl');

function replEval(cmd, context, filename, callback) {
  let result;
  try {
    result = interpret(cmd);
  } catch (e) {
    if (/^unexpected end of input$/.test(e.message)) {
      return callback(new repl.Recoverable(e));
    }
    throw e;
  }
  return callback(null, result);
}

function replWriter(output) {
  if (output === undefined) {
    return chalk.bold.red('undefined');
  }
  return output;
}

repl.start({
  prompt: `${chalk.white.bgBlue.bold(' µ')}${chalk.white.bgBlue('Lisp ')}${chalk.blue('▶')} `,
  eval: replEval,
  writer: replWriter,
});
