// @flow

import type { Expression } from './expression/Expression';

function print(expression: Expression): string | typeof undefined {
  if (expression instanceof Array) {
    if (expression.length === 0) {
      return 'NIL';
    }
    return `(${expression.map(print).join(' ')})`;
  }
  return expression;
}

export default print;
