// @flow

import Environment from './Environment';
import type { Expression } from '../expression/Expression';

class Evaluator {
  static stack: Array<mixed>;

  static quote(expressions: Array<Expression>): Expression {
    if (expressions.length !== 1) {
      throw new Error('quote expects a single operand!');
    }
    return expressions[0];
  }

  static atom(expressions: Array<Expression>, environment: Environment, result: Expression => void) {
    if (expressions.length !== 1) {
      throw new Error('atom expects a single operand!');
    }
    const value: Expression = Evaluator.evaluate(expressions[0], environment);
    if (value === undefined) {
      throw new Error('oops in atom');
    }
    if (typeof value === 'string' || value.length === 0) {
      Evaluator.stack.push(() => result('t'));
    }
    Evaluator.stack.push(() => result([]));
  }

  static eq(expressions: Array<Expression>, environment: Environment, result: Expression => void) {
    if (expressions.length !== 2) {
      throw new Error('eq expects two operands!');
    }
    Evaluator.doEvaluate(expressions[0], environment, x => Evaluator.doEvaluate(expressions[1], environment, (y) => {
      if (typeof x === 'string' && typeof y === 'string' && x === y) {
        Evaluator.stack.push(() => result('t'));
      } else if (Array.isArray(x) && Array.isArray(y) && x.length === 0 && y.length === 0) {
        Evaluator.stack.push(() => result('t'));
      } else {
        Evaluator.stack.push(() => result([]));
      }
    }));
  }

  static car(expressions: Array<Expression>, environment: Environment, result: Expression => void): Expression {
    if (expressions.length !== 1) {
      throw new Error('car expects a single operand!');
    }
    Evaluator.stack.push(() => {
      Evaluator.doEvaluate(expressions[0], environment, (value) => {
        if (!Array.isArray(value)) {
          throw new Error('car expects a list!');
        }
        result(value[0]);
      });
    });
  }

  static cdr(expressions: Array<Expression>, environment: Environment, result: Expression => void): Expression {
    if (expressions.length !== 1) {
      throw new Error('cdr expects a single operand!');
    }
    Evaluator.stack.push(() => {
      Evaluator.doEvaluate(expressions[0], environment, (value) => {
        if (!Array.isArray(value)) {
          throw new Error('cdr expects a list!');
        }
        result(value.slice(1));
      });
    });
  }

  static cons(expressions: Array<Expression>, environment: Environment, result: Expression => void): Expression {
    if (expressions.length !== 2) {
      throw new Error('cons expects two operands!');
    }
    Evaluator.stack.push(() => {
      Evaluator.doEvaluate(expressions[0], environment, x => Evaluator.doEvaluate(expressions[1], environment, (y) => {
        if (!Array.isArray(y)) {
          throw new Error('cons expects a list as second operand!');
        }
        y.unshift(x);
        result(y);
      }));
    });
  }

  static cond(expressions: Array<Expression>, environment: Environment, result: Expression => void): Expression {
    Evaluator.stack.push(() => {
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
      let called: boolean;
      Evaluator.stack.push(() => {
        if (!called) {
          result([]);
        }
      });
      for (let i = 0; i < expressions.length; i += 1) {
        Evaluator.doEvaluate(operandLists[i].p, environment, (value) => {
          if (value === 't') {
            called = true;
            Evaluator.doEvaluate(operandLists[i].e, environment, result);
          }
        });
      }
    });
  }

  static call(name: string, expressions: Array<Expression>, environment: Environment, result: Expression => void): Expression {
    const lambdaExpression: Array<Expression> = expressions.slice();
    lambdaExpression.unshift(environment.get(name));
    Evaluator.doEvaluate(lambdaExpression, environment, result);
  }

  static lambda(lambdaExpression: Array<Expression>, args: Array<Expression>, environment: Environment, result: Expression => void): Expression {
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
    Evaluator.stack.push(() => Evaluator.doEvaluate(expression, extendedEnv, result));
    Evaluator.stack.push(() => {
      for (let i = 0; i < parameters.length; i += 1) {
        Evaluator.doEvaluate(args[i], environment, arg => extendedEnv.put(parameters[i], arg));
      }
    });
  }

  static label(labelExpression: Array<Expression>, args: Array<Expression>, environment: Environment, result: Expression => void) {
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
    Evaluator.lambda(lambdaExpression, args, labelEnv, result);
  }

  static defun(expressions: Array<Expression>, environment: Environment, result: Expression => void) {
    if (typeof expressions[0] !== 'string') {
      throw new Error();
    }
    const name: string = expressions[0];
    const parameters = expressions[1];
    const expression = expressions[2];
    environment.put(name, ['label', name, ['lambda', parameters, expression]]);
    result(undefined);
  }

  static evaluateCall(operator: string, operands: Array<Expression>, environment: Environment, result: Expression => void) {
    switch (operator) {
      case 'quote':
        Evaluator.stack.push(() => result(Evaluator.quote(operands)));
        break;
      case 'atom':
        Evaluator.stack.push(() => Evaluator.atom(operands, environment, result));
        break;
      case 'eq':
        Evaluator.stack.push(() => Evaluator.eq(operands, environment, result));
        break;
      case 'car':
        Evaluator.stack.push(() => Evaluator.car(operands, environment, result));
        break;
      case 'cdr':
        Evaluator.stack.push(() => Evaluator.cdr(operands, environment, result));
        break;
      case 'cons':
        Evaluator.stack.push(() => Evaluator.cons(operands, environment, result));
        break;
      case 'cond':
        Evaluator.stack.push(() => Evaluator.cond(operands, environment, result));
        break;
      case 'defun':
        Evaluator.stack.push(() => Evaluator.defun(operands, environment, result));
        break;
      default:
        Evaluator.stack.push(() => Evaluator.call(operator, operands, environment, result));
    }
  }

  static evaluateList(expression: Array<Expression>, environment: Environment, result: Expression => void) {
    if (expression.length === 0) {
      throw new Error('no operator in call!');
    }
    if (expression[0] === undefined) {
      throw new Error('invalid operator in call!');
    }
    if (typeof expression[0] === 'string') {
      return Evaluator.evaluateCall(expression[0], expression.slice(1), environment, result);
    }
    if (expression[0].length === 0) {
      throw new Error('no operator in apply!');
    }
    if (typeof expression[0][0] !== 'string') {
      throw new Error('invalid operator in apply!');
    }
    switch (expression[0][0]) {
      case 'label':
        return Evaluator.label(expression[0], expression.slice(1), environment, result);
      case 'lambda':
        return Evaluator.lambda(expression[0], expression.slice(1), environment, result);
      default:
        throw new Error(`unknown function '${expression[0][0]}'!`);
    }
  }

  static doEvaluate(expression: Expression, environment: Environment, result: (Expression) => void) {
    if (!expression) {
      Evaluator.stack.push(() => result(undefined));
    }
    if (typeof expression === 'string') {
      Evaluator.stack.push(() => result(environment.get(expression)));
    } else {
      Evaluator.evaluateList(expression, environment, result);
    }
  }

  static evaluate(expression: Expression, environment: Environment): Expression {
    Evaluator.stack = [];
    let x: Expression;
    Evaluator.doEvaluate(expression, environment, (r) => {
      x = r;
    });
    while (Evaluator.stack.length > 0) {
      Evaluator.stack.pop()();
    }
    return x;
  }
}

export default Evaluator;
