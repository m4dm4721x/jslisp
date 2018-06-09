// @flow

import read from './reader/Reader';
import evaluate from './Evaluator';

test('1', () => {
  expect(evaluate(read('(quote a)'))).toEqual('a');
});

test('2', () => {
  expect(evaluate(read('(quote (a b c))'))).toEqual(['a', 'b', 'c']);
});

test('3', () => {
  expect(evaluate(read('(atom (quote a))'))).toEqual('t');
});

test('4', () => {
  expect(evaluate(read('(atom (quote (a b c)))'))).toEqual([]);
});

test('5', () => {
  expect(evaluate(read('(atom (quote ()))'))).toEqual('t');
});

test('6', () => {
  expect(evaluate(read('(atom (atom (quote a)))'))).toEqual('t');
});

test('7', () => {
  expect(evaluate(read('(atom (quote (atom (quote a))))'))).toEqual([]);
});

test('8', () => {
  expect(evaluate(read('(eq (quote a) (quote a))'))).toEqual('t');
});

test('9', () => {
  expect(evaluate(read('(eq (quote a) (quote b))'))).toEqual([]);
});

test('10', () => {
  expect(evaluate(read('(eq (quote ()) (quote ()))'))).toEqual('t');
});

test('11', () => {
  expect(evaluate(read('(car (quote (a b c)))'))).toEqual('a');
});

test('12', () => {
  expect(evaluate(read('(cdr (quote (a b c)))'))).toEqual(['b', 'c']);
});

test('13', () => {
  expect(evaluate(read('(cons (quote a) (quote (b c)))'))).toEqual(['a', 'b', 'c']);
});

test('14', () => {
  expect(evaluate(read('(cons (quote a) (cons (quote b) (cons (quote c) (quote ()))))'))).toEqual(['a', 'b', 'c']);
});

test('15', () => {
  expect(evaluate(read('(car (cons (quote a) (quote (b c))))'))).toEqual('a');
});

test('16', () => {
  expect(evaluate(read('(cdr (cons (quote a) (quote (b c))))'))).toEqual(['b', 'c']);
});

test('17', () => {
  expect(evaluate(read('(cond ((eq (quote a) (quote b)) (quote first)) ((atom (quote a)) (quote second)))'))).toEqual('second');
});
