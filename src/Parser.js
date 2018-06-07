// @flow

import TokenKind from './TokenKind';
import Lexer from './Lexer';

function parse(input: string): Object {
  const lexer = new Lexer(input);
  let result;
  const stack = [];
  let token = lexer.getNextToken();
  while (token.tokenKind !== TokenKind.END_OF_INPUT) {
    if (result !== undefined) {
      throw new Error('syntax error');
    }
    if (token.tokenKind === TokenKind.LEFT_PARENTHESIS) {
      stack.push([]);
    } else if (token.tokenKind === TokenKind.RIGHT_PARENTHESIS) {
      if (stack.length > 0) {
        const list = stack.pop();
        if (stack.length > 0) {
          stack[stack.length - 1].push(list);
        } else {
          result = list;
        }
      } else {
        throw new Error('syntax error');
      }
    } else if (stack.length === 0) {
      result = token.lexeme;
    } else {
      stack[stack.length - 1].push(token.lexeme);
    }
    token = lexer.getNextToken();
  }
  if (stack.length > 0) {
    throw new Error('syntax error');
  }
  return result;
}

export default parse;
