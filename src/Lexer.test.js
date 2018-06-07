// @flow

import Lexer from './Lexer';
import TokenKind from './TokenKind';

test('an empty input is tokenized correctly', () => {
  const lexer = new Lexer('');
  expect(lexer.getNextToken()).toEqual({ tokenKind: TokenKind.END_OF_INPUT, lexeme: undefined });
});

test('a simple expression is tokenized correctly', () => {
  const lexer = new Lexer('(abc (def ghi))');
  expect(lexer.getNextToken()).toEqual({ tokenKind: TokenKind.LEFT_PARENTHESIS, lexeme: undefined });
  expect(lexer.getNextToken()).toEqual({ tokenKind: TokenKind.ATOM, lexeme: 'abc' });
  expect(lexer.getNextToken()).toEqual({ tokenKind: TokenKind.LEFT_PARENTHESIS, lexeme: undefined });
  expect(lexer.getNextToken()).toEqual({ tokenKind: TokenKind.ATOM, lexeme: 'def' });
  expect(lexer.getNextToken()).toEqual({ tokenKind: TokenKind.ATOM, lexeme: 'ghi' });
  expect(lexer.getNextToken()).toEqual({ tokenKind: TokenKind.RIGHT_PARENTHESIS, lexeme: undefined });
  expect(lexer.getNextToken()).toEqual({ tokenKind: TokenKind.RIGHT_PARENTHESIS, lexeme: undefined });
  expect(lexer.getNextToken()).toEqual({ tokenKind: TokenKind.END_OF_INPUT, lexeme: undefined });
});

test('an empty list is tokenized correctly', () => {
  const lexer = new Lexer('()');
  expect(lexer.getNextToken()).toEqual({ tokenKind: TokenKind.LEFT_PARENTHESIS, lexeme: undefined });
  expect(lexer.getNextToken()).toEqual({ tokenKind: TokenKind.RIGHT_PARENTHESIS, lexeme: undefined });
  expect(lexer.getNextToken()).toEqual({ tokenKind: TokenKind.END_OF_INPUT, lexeme: undefined });
});
