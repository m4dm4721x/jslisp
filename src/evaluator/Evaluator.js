// @flow

import Environment from './Environment';
import type { Expression } from '../expression/Expression';

class Evaluator {
  static quote(expressions: Array<Expression>): Expression {
    if (expressions.length !== 1) {
      throw new Error('quote expects a single operand!');
    }
    return expressions[0];
  }

  static atom(expressions: Array<Expression>, environment: Environment): Expression {
    if (expressions.length !== 1) {
      throw new Error('atom expects a single operand!');
    }
    const value: Expression = Evaluator.evaluate(expressions[0], environment);
    if (value === undefined) {
      throw new Error('oops in atom');
    }
    if (typeof value === 'string' || value.length === 0) {
      return 't';
    }
    return [];
  }

  static eq(expressions: Array<Expression>, environment: Environment): Expression {
    if (expressions.length !== 2) {
      throw new Error('eq expects two operands!');
    }
    const x = Evaluator.evaluate(expressions[0], environment);
    const y = Evaluator.evaluate(expressions[1], environment);
    if (typeof x === 'string' && typeof y === 'string' && x === y) {
      return 't';
    } else if (Array.isArray(x) && Array.isArray(y) && x.length === 0 && y.length === 0) {
      return 't';
    }
    return [];
  }

  static car(expressions: Array<Expression>, environment: Environment): Expression {
    if (expressions.length !== 1) {
      throw new Error('car expects a single operand!');
    }
    const value = Evaluator.evaluate(expressions[0], environment);
    if (!Array.isArray(value)) {
      throw new Error('car expects a list!');
    }
    return value[0];
  }

  static cdr(expressions: Array<Expression>, environment: Environment): Expression {
    if (expressions.length !== 1) {
      throw new Error('cdr expects a single operand!');
    }
    const value = Evaluator.evaluate(expressions[0], environment);
    if (!Array.isArray(value)) {
      throw new Error('cdr expects a list!');
    }
    return value.slice(1);
  }

  static cons(expressions: Array<Expression>, environment: Environment): Expression {
    if (expressions.length !== 2) {
      throw new Error('cons expects two operands!');
    }
    const x = Evaluator.evaluate(expressions[0], environment);
    const y = Evaluator.evaluate(expressions[1], environment);
    if (!Array.isArray(y)) {
      throw new Error('cons expects a list as second operand!');
    }
    y.unshift(x);
    return y;
  }

  static cond(expressions: Array<Expression>, environment: Environment): Expression {
    const operandLists = [];
    for (let i = 0; i < expressions.length; i += 1) {
      if (!Array.isArray(expressions[i])) {
        throw new Error('cond expects its operands to be lists!');
      }
      if (expressions[i].length !== 2) {
        throw new Error('cond operand list must have length 2!');
      }
      operandLists.push({ p: expressions[i][0], e: expressions[i][1] });
    }
    for (let i = 0; i < expressions.length; i += 1) {
      const value = Evaluator.evaluate(operandLists[i].p, environment);
      if (value === 't') {
        return Evaluator.evaluate(operandLists[i].e, environment);
      }
    }
    return [];
  }

  static call(name: string, expressions: Array<Expression>, environment: Environment): Expression {
    const lambdaExpression: Array<Expression> = expressions.slice();
    lambdaExpression.unshift(environment.get(name));
    return Evaluator.evaluate(lambdaExpression, environment);
  }

  static lambda(lambdaExpression: Array<Expression>, args: Array<Expression>, environment: Environment): Expression {
    if (lambdaExpression.length !== 3) {
      throw new Error('lambda expects two operands!');
    }
    if (!Array.isArray(lambdaExpression[1])) {
      throw new Error('lambda expects its first operand to be a list!');
    }
    const expression: Expression = lambdaExpression[2];
    const parameters: Array<string> = [];
    for (let i = 0; i < lambdaExpression[1].length; i += 1) {
      if (typeof lambdaExpression[1][i] !== 'string') {
        throw new Error('non-atom in parameter list!');
      }
      parameters.push(lambdaExpression[1][i]);
    }
    if (args.length !== parameters.length) {
      throw new Error('invalid number of args!');
    }
    const extendedEnv: Environment = new Environment(environment);
    for (let i = 0; i < parameters.length; i += 1) {
      extendedEnv.put(parameters[i], Evaluator.evaluate(args[i], environment));
    }
    return Evaluator.evaluate(expression, extendedEnv);
  }

  static label(labelExpression: Array<Expression>, args: Array<Expression>, environment: Environment): Expression {
    if (labelExpression.length !== 3) {
      throw new Error('label expects two operands!');
    }
    if (typeof labelExpression[1] !== 'string') {
      throw new Error('label\'s first operand must be an atom!');
    }
    const labeled: string = labelExpression[1];
    if (!Array.isArray(labelExpression[2])) {
      throw new Error('label\'s second operand must be a list!');
    }
    const lambdaExpression = labelExpression[2];
    const labelEnv: Environment = new Environment(environment);
    labelEnv.put(labeled, lambdaExpression);
    return Evaluator.lambda(lambdaExpression, args, labelEnv);
  }

  static defun(expressions: Array<Expression>, environment: Environment): Expression {
    if (typeof expressions[0] !== 'string') {
      throw new Error();
    }
    const name: string = expressions[0];
    const parameters = expressions[1];
    const expression = expressions[2];
    environment.put(name, ['label', name, ['lambda', parameters, expression]]);
  }

  static evaluateCall(operator: string, operands: Array<Expression>, environment: Environment) {
    switch (operator) {
      case 'quote':
        return Evaluator.quote(operands);
      case 'atom':
        return Evaluator.atom(operands, environment);
      case 'eq':
        return Evaluator.eq(operands, environment);
      case 'car':
        return Evaluator.car(operands, environment);
      case 'cdr':
        return Evaluator.cdr(operands, environment);
      case 'cons':
        return Evaluator.cons(operands, environment);
      case 'cond':
        return Evaluator.cond(operands, environment);
      case 'defun':
        return Evaluator.defun(operands, environment);
      default:
        return Evaluator.call(operator, operands, environment);
    }
  }

  static evaluateList(expression: Array<Expression>, environment: Environment) {
    if (expression.length === 0) {
      throw new Error('no operator in call!');
    }
    if (expression[0] === undefined) {
      throw new Error('invalid operator in call!');
    }
    if (typeof expression[0] === 'string') {
      return Evaluator.evaluateCall(expression[0], expression.slice(1), environment);
    }
    if (expression[0].length === 0) {
      throw new Error('no operator in apply!');
    }
    if (typeof expression[0][0] !== 'string') {
      throw new Error('invalid operator in apply!');
    }
    switch (expression[0][0]) {
      case 'label':
        return Evaluator.label(expression[0], expression.slice(1), environment);
      case 'lambda':
        return Evaluator.lambda(expression[0], expression.slice(1), environment);
      default:
        throw new Error(`unknown function '${expression[0][0]}'!`);
    }
  }

  static evaluate(expression: Expression, environment: Environment): Expression {
    if (!expression) {
      return undefined;
    }
    if (typeof expression === 'string') {
      return environment.get(expression);
    }
    return Evaluator.evaluateList(expression, environment);
  }
}

export default Evaluator;
