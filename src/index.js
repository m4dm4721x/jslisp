// @flow

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
  return output;
}

repl.start({
  prompt: 'µLisp > ',
  eval: replEval,
  writer: replWriter,
});
