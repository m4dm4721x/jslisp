// @flow

import evaluate from './Evaluator';
import read from '../reader/Reader';

class Environment {
  map: Map<string, mixed>;

  static newEmptyEnvironment(): Environment {
    return new Environment(new Map());
  }

  static newDefaultEnvironment(): Environment {
    const result: Environment = new Environment(new Map());

    result.map.set('quote', (operands: Array<mixed>/* , environment: Environment */): mixed => {
      if (operands.length !== 1) {
        throw new Error('quote expects a single operand!');
      }
      return operands[0];
    });

    result.map.set('atom', (operands: Array<mixed>, environment: Environment): mixed => {
      if (operands.length !== 1) {
        throw new Error('atom expects a single operand!');
      }
      const value = evaluate(operands[0], environment);
      if (typeof value === 'string' || (Array.isArray(value) && value.length === 0)) {
        return 't';
      }
      return [];
    });

    result.map.set('eq', (operands: Array<mixed>, environment: Environment): mixed => {
      if (operands.length !== 2) {
        throw new Error('eq expects two operands!');
      }
      const x = evaluate(operands[0], environment);
      const y = evaluate(operands[1], environment);
      if (typeof x === 'string' && typeof y === 'string' && x === y) {
        return 't';
      } else if (Array.isArray(x) && Array.isArray(y) && x.length === 0 && y.length === 0) {
        return 't';
      }
      return [];
    });

    result.map.set('car', (operands: Array<mixed>, environment: Environment): mixed => {
      if (operands.length !== 1) {
        throw new Error('car expects a single operand!');
      }
      const value = evaluate(operands[0], environment);
      if (!Array.isArray(value)) {
        throw new Error('car expects a list!');
      }
      return value[0];
    });

    result.map.set('cdr', (operands: Array<mixed>, environment: Environment): mixed => {
      if (operands.length !== 1) {
        throw new Error('cdr expects a single operand!');
      }
      const value = evaluate(operands[0], environment);
      if (!Array.isArray(value)) {
        throw new Error('cdr expects a list!');
      }
      return value.slice(1);
    });

    result.map.set('cons', (operands: Array<mixed>, environment: Environment): mixed => {
      if (operands.length !== 2) {
        throw new Error('cons expects two operands!');
      }
      const x = evaluate(operands[0], environment);
      const y = evaluate(operands[1], environment);
      if (!Array.isArray(y)) {
        throw new Error('cons expects a list as second operand!');
      }
      y.unshift(x);
      return y;
    });

    result.map.set('cond', (operands: Array<mixed>, environment: Environment): mixed => {
      const operandLists = [];
      for (let i = 0; i < operands.length; i += 1) {
        if (!Array.isArray(operands[i])) {
          throw new Error('cond expects its operands to be lists!');
        }
        if (operands[i].length !== 2) {
          throw new Error('cond operand list must have length 2!');
        }
        operandLists.push({ p: operands[i][0], e: operands[i][1] });
      }
      for (let i = 0; i < operands.length; i += 1) {
        const value = evaluate(operandLists[i].p, environment);
        if (value === 't') {
          return evaluate(operandLists[i].e, environment);
        }
      }
      return [];
    });

    result.map.set('lambda', (operands: Array<mixed>/* , environment: Environment */): mixed => {
      if (operands.length !== 2) {
        throw new Error('lambda expects two operands!');
      }
      if (!Array.isArray(operands[0])) {
        throw new Error('lambda expects its first operand to be a list!');
      }
      const parameters: Array<string> = [];
      for (let i = 0; i < operands[0].length; i += 1) {
        if (typeof operands[0][i] !== 'string') {
          throw new Error('invalid parameter list!');
        }
        parameters.push(operands[0][i]);
      }
      return function (args: Array<mixed>, callEnvironment: Environment) {
        const expression = operands[1];
        if (args.length !== parameters.length) {
          throw new Error('invalid number of args!');
        }
        const extendedEnv: Environment = callEnvironment.clone();
        for (let i = 0; i < args.length; i += 1) {
          extendedEnv.put(parameters[i], evaluate(args[i], callEnvironment));
        }
        return evaluate(expression, extendedEnv);
      };
    });

    result.map.set('label', (operands: Array<mixed>, environment: Environment): mixed => {
      if (operands.length !== 2) {
        throw new Error('label expects two operands!');
      }
      if (typeof operands[0] !== 'string') {
        throw new Error('label\'s first operand must be an atom!');
      }
      const labeled: string = operands[0];
      if (!Array.isArray(operands[1])) {
        throw new Error('label\'s second operand must be a list!');
      }
      const y = evaluate(operands[1], environment);
      if (typeof y !== 'function') {
        throw new Error('label\'s seconds operand is not a lambda!');
      }
      return function (args: Array<mixed>, callEnvironment: Environment) {
        const labelEnv: Environment = callEnvironment.clone();
        labelEnv.put(labeled, y);
        return y(labelEnv, args);
      };
    });

    result.map.set('defun', (operands: Array<mixed>, environment: Environment): mixed => {
      if (operands.length !== 3) {
        throw new Error('defun expects two operands!');
      }
      if (typeof operands[0] !== 'string') {
        throw new Error('label\'s first operand must be an atom!');
      }
      const name: string = operands[0];
      if (!Array.isArray(operands[1])) {
        throw new Error('lambda expects its seconds operand to be a list!');
      }
      const parameters: Array<string> = [];
      for (let i = 0; i < operands[1].length; i += 1) {
        if (typeof operands[1][i] !== 'string') {
          throw new Error('invalid parameter list!');
        }
        parameters.push(operands[1][i]);
      }
      const f = function (args: Array<mixed>, callEnvironment: Environment) {
        if (args.length !== parameters.length) {
          throw new Error('invalid number of args!');
        }
        const extendedEnv: Environment = callEnvironment.clone();
        for (let i = 0; i < args.length; i += 1) {
          extendedEnv.put(parameters[i], evaluate(args[i], callEnvironment));
        }
        return evaluate(operands[2], extendedEnv);
      };
      environment.put(name, f);
    });

    evaluate(read('(defun cadr (e) (car (cdr e)))'), result);
    evaluate(read('(defun caddr (e) (car (cdr (cdr e))))'), result);
    evaluate(read('(defun cdar (e) (cdr (car e)))'), result);

    evaluate(read('(defun null (x) (eq x (quote ())))'), result);

    return result;
  }

  constructor(map: Map<string, mixed>) {
    this.map = new Map(map);
  }

  clone(): Environment {
    return new Environment(this.map);
  }

  get(atom: string): mixed {
    return this.map.get(atom);
  }

  put(atom: string, value: mixed): void {
    this.map.set(atom, value);
  }

  has(atom: string): boolean {
    return this.map.has(atom);
  }
}

export default Environment;
