import axios from 'axios';
import * as MockAdapter from 'axios-mock-adapter';
import * as fs from 'fs';
import { Hashflags, IHashflagsJson } from '../src/Hashflags';

/**
 * Tests for the Hashflags class
 */

beforeAll(() => {
  const mock: MockAdapter = new MockAdapter(axios);
  const mockData: IHashflagsJson = JSON.parse(
    fs.readFileSync('./__tests__/activeHashflags.json', 'utf8')
  );
  mock
    .onGet('https://hashflags.blob.core.windows.net/json/activeHashflags')
    .reply(200, mockData);
});

describe('Test', () => {
  let hashflags: Hashflags;

  beforeAll(async () => {
    hashflags = new Hashflags();
    await hashflags.fetch();
  });

  it('Should have baseUrl available', () => {
    expect(hashflags.baseUrl).not.toBeUndefined();
    expect(hashflags.baseUrl.host).not.toBeUndefined();
  });

  it('Should have activeHashflags available', () => {
    expect(hashflags.activeHashflags).not.toBeUndefined();
  });

  it('Should contain olympictorchrelay hashtag', () => {
    expect(hashflags.activeHashflags.has('olympictorchrelay')).toBeTruthy();
    expect(hashflags.activeHashflags.get('olympictorchrelay')).toEqual(
      'OlympicFlameEmoji/OlympicFlameEmoji.png'
    );
  });
});
