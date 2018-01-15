import { Hashflags } from '../src/hashflags';

it('Should have baseUrl available', async () => {
  const hashflags = new Hashflags();
  await hashflags.fetch();
  expect(hashflags.baseUrl).not.toBeUndefined();
});

it('Should have activeHashflags available', async () => {
  const hashflags = new Hashflags();
  await hashflags.fetch();
  expect(hashflags.activeHashflags).not.toBeUndefined();
});
