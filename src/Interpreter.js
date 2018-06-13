// @flow

import read from './reader/Reader';
import Evaluator from './evaluator/Evaluator';
import print from './Printer';
import Environment from './evaluator/Environment';

class Interpreter {
  +environment: Environment;

  constructor() {
    this.environment = Environment.newDefaultEnvironment();
  }

  interpret(input: string): string | typeof undefined {
    return print(Evaluator.evaluate(read(input), this.environment));
  }
}

export default Interpreter;
