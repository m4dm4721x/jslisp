// @flow

import Token from './Token';
import Lexer from './Lexer';
import type { Expression } from '../expression/Expression';

function reportError(token: Token) {
  throw new Error(`syntax error at (${token.row}:${token.column})`);
}

function read(input: string): Expression {
  const lexer: Lexer = new Lexer(input);
  let result: Expression;
  const stack = [];
  let token: Token = lexer.getNextToken();
  while (!token.isOfKind('END_OF_INPUT')) {
    if (result !== undefined) {
      reportError(token);
    }
    if (token.isOfKind('LEFT_PARENTHESIS')) {
      stack.push([]);
    } else if (token.isOfKind('RIGHT_PARENTHESIS')) {
      if (stack.length > 0) {
        const list = stack.pop();
        if (stack.length > 0) {
          stack[stack.length - 1].push(list);
        } else {
          result = list;
        }
      } else {
        reportError(token);
      }
    } else if (stack.length === 0) {
      result = token.lexeme;
    } else {
      stack[stack.length - 1].push(token.lexeme);
    }
    token = lexer.getNextToken();
  }
  if (stack.length > 0) {
    throw new Error('unexpected end of input');
  }
  return result;
}

export default read;
