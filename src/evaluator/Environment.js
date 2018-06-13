// @flow

import Evaluator from './Evaluator';
import read from '../reader/Reader';
import { type Expression } from '../expression/Expression';

class Environment {
  +parentEnvironment: Environment | typeof undefined;
  +map: Map<string, Expression>;

  static newDefaultEnvironment(): Environment {
    const environment: Environment = new Environment();

    environment.put('NIL', []);
    environment.put('t', 't');

    Evaluator.evaluate(read('(defun cadr (e) (car (cdr e)))'), environment);
    Evaluator.evaluate(read('(defun caddr (e) (car (cdr (cdr e))))'), environment);
    Evaluator.evaluate(read('(defun cdar (e) (cdr (car e)))'), environment);

    Evaluator.evaluate(read('(defun null (x) (eq x (quote ())))'), environment);
    Evaluator.evaluate(read('(defun and (x y) (cond (x (cond (y (quote t)) ((quote t) (quote ()))))((quote t) (quote ()))))'), environment);
    Evaluator.evaluate(read('(defun not (x) (cond (x (quote ())) ((quote t) (quote t))))'), environment);

    return environment;
  }

  constructor(parentEnvironment?: Environment) {
    this.map = new Map();
    this.parentEnvironment = parentEnvironment;
  }

  get(atom: string): Expression {
    if (!this.parentEnvironment && !this.map.has(atom)) {
      throw new Error(`atom '${atom}' has no value!`);
    }
    return this.map.get(atom) || this.parentEnvironment.get(atom);
  }

  put(atom: string, value: Expression): void {
    this.map.set(atom, value);
  }
}

export default Environment;
