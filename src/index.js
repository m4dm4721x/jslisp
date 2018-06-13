// @flow

import chalk from 'chalk';

import Interpreter from './Interpreter';

const repl = require('repl');

const interpreter: Interpreter = new Interpreter();

function replEval(cmd: string, context, filename, callback) {
  let result;
  try {
    result = interpreter.interpret(cmd);
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
