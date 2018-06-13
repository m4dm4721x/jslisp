// @flow

import read from './Reader';

test('dummy', () => {
  expect(read('((a))')).toEqual([['a']]);
});

test('an empty input is parsed correctly', () => {
  expect(read('')).toBeUndefined();
});

test('an atom is parsed correctly', () => {
  expect(read('a')).toEqual('a');
});

test('an empty list is parsed correctly', () => {
  expect(read('()')).toEqual([]);
});

test('a list containing a list is parsed correctly', () => {
  expect(read('(())')).toEqual([[]]);
});

test('a simple list correctly', () => {
  expect(read('((a b (c)) a ())')).toEqual([['a', 'b', ['c']], 'a', []]);
});

test('two atoms are an error', () => {
  function parseInput() {
    read('a b');
  }
  expect(parseInput).toThrowError(/^syntax error at \(1:3\)$/);
});

test('a left parenthesis is an error', () => {
  function parseInput() {
    read('(');
  }
  expect(parseInput).toThrowError(/^unexpected end of input$/);
});

test('two left parentheses are an error', () => {
  function parseInput() {
    read('((');
  }
  expect(parseInput).toThrowError(/^unexpected end of input$/);
});

test('a right parenthesis is an error', () => {
  function parseInput() {
    read(')');
  }
  expect(parseInput).toThrowError(/^syntax error at \(1:1\)$/);
});

test('two right parentheses are an error', () => {
  function parseInput() {
    read('))');
  }
  expect(parseInput).toThrowError(/^syntax error at \(1:1\)$/);
});

test('one left and two right parentheses are an error', () => {
  function parseInput() {
    read('())');
  }
  expect(parseInput).toThrowError(/^syntax error at \(1:3\)$/);
});
