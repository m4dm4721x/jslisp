// @flow

import Evaluator from './Evaluator';
import read from '../reader/Reader';
import { type Expression } from '../expression/Expression';

class Environment {
  +map: Map<string, Expression>;

  static newDefaultEnvironment(): Environment {
    const result: Environment = new Environment(new Map());

    result.put('NIL', []);
    result.put('t', 't');

    Evaluator.evaluate(read('(defun cadr (e) (car (cdr e)))'), result);
    Evaluator.evaluate(read('(defun caddr (e) (car (cdr (cdr e))))'), result);
    Evaluator.evaluate(read('(defun cdar (e) (cdr (car e)))'), result);

    Evaluator.evaluate(read('(defun null (x) (eq x (quote ())))'), result);
    Evaluator.evaluate(read('(defun and (x y) (cond (x (cond (y (quote t)) ((quote t) (quote ()))))((quote t) (quote ()))))'), result);
    Evaluator.evaluate(read('(defun not (x) (cond (x (quote ())) ((quote t) (quote t))))'), result);

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
      throw new Error(`atom '${atom}' has no value!`);
    }
    return this.map.get(atom);
  }

  put(atom: string, value: Expression): void {
    this.map.set(atom, value);
  }
}

export default Environment;
