// @flow

import Environment from './Environment';

test('1', () => {
  const environment: Environment = Environment.newDefaultEnvironment();
  function parseInput() {
    environment.get('bla blub');
  }
  expect(parseInput).toThrowError(/^atom 'bla blub' has no value!$/);
});
