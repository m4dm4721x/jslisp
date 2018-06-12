// @flow

import read from '../reader/Reader';
import evaluate from './Evaluator';
import Environment from './Environment';

test('1', () => {
  expect(evaluate(read('(quote a)'), Environment.newDefaultEnvironment())).toEqual('a');
});

test('2', () => {
  expect(evaluate(read('(quote (a b c))'), Environment.newDefaultEnvironment())).toEqual(['a', 'b', 'c']);
});

test('3', () => {
  expect(evaluate(read('(atom (quote a))'), Environment.newDefaultEnvironment())).toEqual('t');
});

test('4', () => {
  expect(evaluate(read('(atom (quote (a b c)))'), Environment.newDefaultEnvironment())).toEqual([]);
});

test('5', () => {
  expect(evaluate(read('(atom (quote ()))'), Environment.newDefaultEnvironment())).toEqual('t');
});

test('6', () => {
  expect(evaluate(read('(atom (atom (quote a)))'), Environment.newDefaultEnvironment())).toEqual('t');
});

test('7', () => {
  expect(evaluate(read('(atom (quote (atom (quote a))))'), Environment.newDefaultEnvironment())).toEqual([]);
});

test('8', () => {
  expect(evaluate(read('(eq (quote a) (quote a))'), Environment.newDefaultEnvironment())).toEqual('t');
});

test('9', () => {
  expect(evaluate(read('(eq (quote a) (quote b))'), Environment.newDefaultEnvironment())).toEqual([]);
});

test('10', () => {
  expect(evaluate(read('(eq (quote ()) (quote ()))'), Environment.newDefaultEnvironment())).toEqual('t');
});

test('11', () => {
  expect(evaluate(read('(car (quote (a b c)))'), Environment.newDefaultEnvironment())).toEqual('a');
});

test('12', () => {
  expect(evaluate(read('(cdr (quote (a b c)))'), Environment.newDefaultEnvironment())).toEqual(['b', 'c']);
});

test('13', () => {
  expect(evaluate(read('(cons (quote a) (quote (b c)))'), Environment.newDefaultEnvironment())).toEqual(['a', 'b', 'c']);
});

test('14', () => {
  expect(evaluate(read('(cons (quote a) (cons (quote b) (cons (quote c) (quote ()))))'), Environment.newDefaultEnvironment())).toEqual(['a', 'b', 'c']);
});

test('15', () => {
  expect(evaluate(read('(car (cons (quote a) (quote (b c))))'), Environment.newDefaultEnvironment())).toEqual('a');
});

test('16', () => {
  expect(evaluate(read('(cdr (cons (quote a) (quote (b c))))'), Environment.newDefaultEnvironment())).toEqual(['b', 'c']);
});

test('17', () => {
  expect(evaluate(read('(cond ((eq (quote a) (quote b)) (quote first)) ((atom (quote a)) (quote second)))'), Environment.newDefaultEnvironment())).toEqual('second');
});

test('18', () => {
  expect(evaluate(read('((lambda (x) (cons x (quote (b)))) (quote a))'), Environment.newDefaultEnvironment())).toEqual(['a', 'b']);
});

test('19', () => {
  expect(evaluate(read('((lambda (x y) (cons x (cdr y))) (quote z) (quote (a b c)))'), Environment.newDefaultEnvironment())).toEqual(['z', 'b', 'c']);
});

test('20', () => {
  expect(evaluate(read('((lambda (f) (f (quote (b c)))) (quote (lambda (x) (cons (quote a) x))))'), Environment.newDefaultEnvironment())).toEqual(['a', 'b', 'c']);
});

test('21', () => {
  const environment: Environment = Environment.newDefaultEnvironment();
  evaluate(read('(defun subst (x y z) (cond ((atom z) (cond ((eq z y) x) ((quote t) z))) ((quote t) (cons (subst x y (car z)) (subst x y (cdr z))))))'), environment);
  expect(evaluate(read('(subst (quote m) (quote b) (quote (a b (a b c) d)))'), environment)).toEqual(['a', 'm', ['a', 'm', 'c'], 'd']);
});

test('22', () => {
  const environment: Environment = Environment.newDefaultEnvironment();
  evaluate(read('(defun f (x y) x)'), environment);
  expect(evaluate(read('(f (quote a) (quote b))'), environment)).toEqual('a');
});

test('23', () => {
  const environment: Environment = Environment.newDefaultEnvironment();
  expect(evaluate(read('(cadr (quote ((a b) (c d) e)))'), environment)).toEqual(['c', 'd']);
});

test('24', () => {
  const environment: Environment = Environment.newDefaultEnvironment();
  expect(evaluate(read('(caddr (quote ((a b) (c d) e)))'), environment)).toEqual('e');
});

test('25', () => {
  const environment: Environment = Environment.newDefaultEnvironment();
  expect(evaluate(read('(cdar (quote ((a b) (c d) e)))'), environment)).toEqual(['b']);
});

test('26', () => {
  const environment: Environment = Environment.newDefaultEnvironment();
  expect(evaluate(read('(null (quote a))'), environment)).toEqual([]);
});

test('27', () => {
  const environment: Environment = Environment.newDefaultEnvironment();
  expect(evaluate(read('(null (quote ()))'), environment)).toEqual('t');
});

test('28', () => {
  const environment: Environment = Environment.newDefaultEnvironment();
  expect(evaluate(read('(and (atom (quote a)) (eq (quote a) (quote a)))'), environment)).toEqual('t');
});

test('29', () => {
  const environment: Environment = Environment.newDefaultEnvironment();
  expect(evaluate(read('(and (atom (quote a)) (eq (quote a) (quote b)))'), environment)).toEqual([]);
});

test('30', () => {
  const environment: Environment = Environment.newDefaultEnvironment();
  expect(evaluate(read('(not (eq (quote a) (quote a)))'), environment)).toEqual([]);
});

test('31', () => {
  const environment: Environment = Environment.newDefaultEnvironment();
  expect(evaluate(read('(not (eq (quote a) (quote b)))'), environment)).toEqual('t');
});
