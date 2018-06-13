// @flow

import Interpreter from './Interpreter';

function interpret(input: string): string | typeof undefined {
  const interpreter: Interpreter = new Interpreter();
  return interpreter.interpret(input);
}

test('1', () => {
  expect(interpret('(quote a)')).toEqual('a');
});

test('2', () => {
  expect(interpret('(quote (a b c))')).toBe('(a b c)');
});

test('3', () => {
  expect(interpret('(atom (quote a))')).toEqual('t');
});

test('4', () => {
  expect(interpret('(atom (quote (a b c)))')).toBe('NIL');
});

test('5', () => {
  expect(interpret('(atom (quote ()))')).toEqual('t');
});

test('6', () => {
  expect(interpret('(atom (atom (quote a)))')).toEqual('t');
});

test('7', () => {
  expect(interpret('(atom (quote (atom (quote a))))')).toBe('NIL');
});

test('8', () => {
  expect(interpret('(eq (quote a) (quote a))')).toEqual('t');
});

test('9', () => {
  expect(interpret('(eq (quote a) (quote b))')).toBe('NIL');
});

test('10', () => {
  expect(interpret('(eq (quote ()) (quote ()))')).toEqual('t');
});

test('11', () => {
  expect(interpret('(car (quote (a b c)))')).toEqual('a');
});

test('12', () => {
  expect(interpret('(cdr (quote (a b c)))')).toBe('(b c)');
});

test('13', () => {
  expect(interpret('(cons (quote a) (quote (b c)))')).toBe('(a b c)');
});

test('14', () => {
  expect(interpret('(cons (quote a) (cons (quote b) (cons (quote c) (quote ()))))')).toBe('(a b c)');
});

test('15', () => {
  expect(interpret('(car (cons (quote a) (quote (b c))))')).toEqual('a');
});

test('16', () => {
  expect(interpret('(cdr (cons (quote a) (quote (b c))))')).toBe('(b c)');
});

test('17', () => {
  expect(interpret('(cond ((eq (quote a) (quote b)) (quote first)) ((atom (quote a)) (quote second)))')).toEqual('second');
});

test('18', () => {
  expect(interpret('')).toBeUndefined();
});
