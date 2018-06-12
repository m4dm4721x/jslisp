// @flow

import evaluate from './Evaluator';
import read from '../reader/Reader';
import type { Expression } from './Expression';

class Environment {
  map: Map<string, Expression>;

  static newEmptyEnvironment(): Environment {
    return new Environment(new Map());
  }

  static newDefaultEnvironment(): Environment {
    const result: Environment = new Environment(new Map());

    evaluate(read('(defun cadr (e) (car (cdr e)))'), result);
    evaluate(read('(defun caddr (e) (car (cdr (cdr e))))'), result);
    evaluate(read('(defun cdar (e) (cdr (car e)))'), result);

    evaluate(read('(defun null (x) (eq x (quote ())))'), result);
    evaluate(read('(defun and (x y) (cond (x (cond (y (quote t)) ((quote t) (quote ()))))((quote t) (quote ()))))'), result);
    evaluate(read('(defun not (x) (cond (x (quote ())) ((quote t) (quote t))))'), result);

    return result;
  }

  constructor(map: Map<string, Expression>) {
    this.map = new Map(map);
  }

  clone(): Environment {
    return new Environment(this.map);
  }

  get(atom: string): Expression {
    if (!this.map.has(atom)) {
      throw new Error(`atom ${atom} has no value!`);
    }
    return this.map.get(atom);
  }

  put(atom: string, value: Expression): void {
    this.map.set(atom, value);
  }

  has(atom: string): boolean {
    return this.map.has(atom);
  }
}

export default Environment;
