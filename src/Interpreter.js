// @flow

import read from './reader/Reader';
import evaluate from './evaluator/Evaluator';
import print from './Printer';
import Environment from './evaluator/Environment';

const environment: Environment = Environment.newDefaultEnvironment();

function interpret(input: string): mixed {
  return print(evaluate(read(input), environment));
}

export default interpret;
