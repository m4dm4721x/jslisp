// @flow

import Environment from './Environment';

function evaluate(expression: mixed, environment: Environment): mixed {
  if (typeof expression === 'string') {
    if (!environment.has(expression)) {
      throw new Error(`atom ${expression} has no value!`);
    }
    return environment.get(expression);
  } else if (Array.isArray(expression)) {
    const operator = evaluate(expression[0], environment);
    if (typeof operator !== 'function') {
      if (Array.isArray(operator) && operator.length > 0 && operator[0] === 'lambda') {
        const f = evaluate(operator, environment);
        if (typeof f !== 'function') {
          throw new Error('failed to evaluate lambda');
        }
        return f(expression.slice(1), environment);
      }
      return expression.map(x => evaluate(x, environment)).unshift(operator);
    }
    return operator(expression.slice(1), environment);
  }
  throw new Error('invalid type of expression');
}

export default evaluate;
