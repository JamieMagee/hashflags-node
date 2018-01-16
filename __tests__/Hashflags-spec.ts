import axios from 'axios';
import * as MockAdapter from 'axios-mock-adapter';
import * as fs from 'fs';
import { URL } from 'url';
import { Hashflags } from '../src/Hashflags';

/**
 * Tests for the Hashflags class
 */

describe('Test', () => {
  let hashflags: Hashflags;

  beforeAll(async () => {
    const mock: MockAdapter = new MockAdapter(axios);
    const mockData: IHashflagsJson = JSON.parse(
      fs.readFileSync('./__tests__/activeHashflags.json', 'utf8')
    );
    mock
      .onGet('https://hashflags.blob.core.windows.net/json/activeHashflags')
      .reply(200, mockData);
    hashflags = await Hashflags.CREATE();
  });
  it('Should have activeHashflags map available', () => {
    expect(hashflags.activeHashflags).not.toBeUndefined();
  });

  it('Should contain olympictorchrelay hashtag', () => {
    expect(hashflags.activeHashflags.has('olympictorchrelay')).toBeTruthy();
    expect(hashflags.activeHashflags.get('olympictorchrelay')).toEqual(
      new URL(
        'https://abs.twimg.com/hashflags/OlympicFlameEmoji/OlympicFlameEmoji.png'
      )
    );
  });
});

interface IHashflagsJson {
  hashflagBaseUrl: string;
  activeHashflags: { [hashflag: string]: string };
}
