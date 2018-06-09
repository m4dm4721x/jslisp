// @flow

import read from './reader/Reader';
import evaluate from './Evaluator';
import print from './Printer';

function interpret(input: string): mixed {
  return print(evaluate(read(input)));
}

export default interpret;
