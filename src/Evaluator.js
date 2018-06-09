// @flow

function evaluate(expression: mixed): mixed {
  if (Array.isArray(expression)) {
    const operator = evaluate(expression.shift());
    if (operator === 'quote') {
      if (expression.length !== 1) {
        throw new Error('quote expects a single operand!');
      }
      return expression[0];
    } else if (operator === 'atom') {
      if (expression.length !== 1) {
        throw new Error('atom expects a single operand!');
      }
      const value = evaluate(expression[0]);
      if (typeof value === 'string' || (Array.isArray(value) && value.length === 0)) {
        return 't';
      }
      return [];
    } else if (operator === 'eq') {
      if (expression.length !== 2) {
        throw new Error('eq expects two operands!');
      }
      const x = evaluate(expression[0]);
      const y = evaluate(expression[1]);
      if (typeof x === 'string' && typeof y === 'string' && x === y) {
        return 't';
      } else if (Array.isArray(x) && Array.isArray(y) && x.length === 0 && y.length === 0) {
        return 't';
      }
      return [];
    } else if (operator === 'car') {
      if (expression.length !== 1) {
        throw new Error('car expects a single operand!');
      }
      const value = evaluate(expression[0]);
      if (!Array.isArray(value)) {
        throw new Error('car expects a list!');
      }
      return value[0];
    } else if (operator === 'cdr') {
      if (expression.length !== 1) {
        throw new Error('cdr expects a single operand!');
      }
      const value = evaluate(expression[0]);
      if (!Array.isArray(value)) {
        throw new Error('cdr expects a list!');
      }
      value.shift();
      return value;
    } else if (operator === 'cons') {
      if (expression.length !== 2) {
        throw new Error('cons expects two operands!');
      }
      const x = evaluate(expression[0]);
      const y = evaluate(expression[1]);
      if (!Array.isArray(y)) {
        throw new Error('cons expects a list as second operand!');
      }
      y.unshift(x);
      return y;
    } else if (operator === 'cond') {
      const operands = [];
      for (let i = 0; i < expression.length; i += 1) {
        if (!Array.isArray(expression[i])) {
          throw new Error('cond expects its operands to be lists!');
        }
        if (expression[i].length !== 2) {
          throw new Error('cond operand list must have length 2!');
        }
        operands.push({ p: expression[i][0], e: expression[i][1] });
      }
      for (let i = 0; i < expression.length; i += 1) {
        const value = evaluate(operands[i].p);
        if (value === 't') {
          return evaluate(operands[i].e);
        }
      }
      return [];
    }
    throw new Error('undefined function');
  } else {
    return expression;
  }
}

export default evaluate;
