// @flow

import Lexer from './Lexer';

test('illegal input throws an error', () => {
  function parseInput() {
    new Lexer('$').getNextToken();
  }
  expect(parseInput).toThrowError(/^illegal character \$ at position 0$/);
});

test('an empty input is tokenized correctly', () => {
  const lexer: Lexer = new Lexer('');
  expect(lexer.getNextToken()).toEqual({
    tokenKind: 'END_OF_INPUT',
    row: 1,
    column: 1,
  });
});

test('an empty line is tokenized correctly', () => {
  const lexer: Lexer = new Lexer('\r');
  expect(lexer.getNextToken()).toEqual({
    tokenKind: 'END_OF_INPUT',
    row: 2,
    column: 1,
  });
});


test('a simple expression is tokenized correctly', () => {
  const lexer: Lexer = new Lexer('(abc (def ghi))');
  expect(lexer.getNextToken()).toMatchObject({
    tokenKind: 'LEFT_PARENTHESIS',
    row: 1,
    column: 1,
  });
  expect(lexer.getNextToken()).toMatchObject({
    tokenKind: 'ATOM',
    row: 1,
    column: 2,
  });
  expect(lexer.getNextToken()).toMatchObject({
    tokenKind: 'LEFT_PARENTHESIS',
    row: 1,
    column: 6,
  });
  expect(lexer.getNextToken()).toMatchObject({
    tokenKind: 'ATOM',
    row: 1,
    column: 7,
  });
  expect(lexer.getNextToken()).toMatchObject({
    tokenKind: 'ATOM',
    row: 1,
    column: 11,
  });
  expect(lexer.getNextToken()).toMatchObject({
    tokenKind: 'RIGHT_PARENTHESIS',
    row: 1,
    column: 14,
  });
  expect(lexer.getNextToken()).toMatchObject({
    tokenKind: 'RIGHT_PARENTHESIS',
    row: 1,
    column: 15,
  });
  expect(lexer.getNextToken()).toMatchObject({
    tokenKind: 'END_OF_INPUT',
    row: 1,
    column: 16,
  });
});

test('an empty list is tokenized correctly', () => {
  const lexer: Lexer = new Lexer('()');
  expect(lexer.getNextToken()).toEqual({
    tokenKind: 'LEFT_PARENTHESIS',
    row: 1,
    column: 1,
  });
  expect(lexer.getNextToken()).toEqual({
    tokenKind: 'RIGHT_PARENTHESIS',
    row: 1,
    column: 2,
  });
  expect(lexer.getNextToken()).toEqual({
    tokenKind: 'END_OF_INPUT',
    row: 1,
    column: 3,
  });
});

test('an empty list with a spanning a new line is tokenized correctly', () => {
  const lexer: Lexer = new Lexer('(\n)');
  expect(lexer.getNextToken()).toEqual({
    tokenKind: 'LEFT_PARENTHESIS',
    row: 1,
    column: 1,
  });
  expect(lexer.getNextToken()).toEqual({
    tokenKind: 'RIGHT_PARENTHESIS',
    row: 2,
    column: 1,
  });
  expect(lexer.getNextToken()).toEqual({
    tokenKind: 'END_OF_INPUT',
    row: 2,
    column: 2,
  });
});

test('an empty list with a spanning a carriage return followed by a new line is tokenized correctly', () => {
  const lexer: Lexer = new Lexer('(\r\n)');
  expect(lexer.getNextToken()).toEqual({
    tokenKind: 'LEFT_PARENTHESIS',
    row: 1,
    column: 1,
  });
  expect(lexer.getNextToken()).toEqual({
    tokenKind: 'RIGHT_PARENTHESIS',
    row: 2,
    column: 1,
  });
  expect(lexer.getNextToken()).toEqual({
    tokenKind: 'END_OF_INPUT',
    row: 2,
    column: 2,
  });
});
