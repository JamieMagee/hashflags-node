import { HashFlag } from '../src/hash-flag';

test('Should greet with message', () => {
  const greeter = new HashFlag('friend');
  expect(greeter.greet()).toBe('Bonjour, friend!');
});
