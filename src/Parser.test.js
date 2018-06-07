import parse from './Parser';

test('an empty input is parsed correctly', () => {
  const result = parse('');
  expect(result).toBeUndefined();
});

test('an atom is parsed correctly', () => {
  const result = parse('a');
  expect(result).toEqual('a');
});

test('an empty list is parsed correctly', () => {
  const result = parse('()');
  expect(result).toEqual([]);
});

test('a list containing a list is parsed correctly', () => {
  const result = parse('(())');
  expect(result).toEqual([[]]);
});

test('a simple list correctly', () => {
  const result = parse('((a b (c)) a ())');
  expect(result).toEqual([['a', 'b', ['c']], 'a', []]);
});

test('a left parenthesis is an error', () => {
  function parseInput() {
    parse('(');
  }
  expect(parseInput).toThrowError(/^syntax error$/);
});

test('two left parentheses are an error', () => {
  function parseInput() {
    parse('((');
  }
  expect(parseInput).toThrowError(/^syntax error$/);
});

test('a right parenthesis is an error', () => {
  function parseInput() {
    parse(')');
  }
  expect(parseInput).toThrowError(/^syntax error$/);
});

test('two right parentheses are an error', () => {
  function parseInput() {
    parse('))');
  }
  expect(parseInput).toThrowError(/^syntax error$/);
});

test('one left and two right parentheses are an error', () => {
  function parseInput() {
    parse('())');
  }
  expect(parseInput).toThrowError(/^syntax error$/);
});
