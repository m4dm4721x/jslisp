// @flow

function print(expression: mixed): mixed {
  if (Array.isArray(expression)) {
    return `(${expression.map(print).join(' ')})`;
  }
  return expression;
}

export default print;
