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
  let olympicTorchURL: URL;

  beforeAll(async () => {
    const mock: MockAdapter = new MockAdapter(axios);
    const mockData: IHashflagsJson = JSON.parse(
      fs.readFileSync('./__tests__/activeHashflags.json', 'utf8')
    );
    mock.onGet(new RegExp('.*')).reply(200, mockData);
    hashflags = await Hashflags.CREATE();

    olympicTorchURL = new URL(
      'https://abs.twimg.com/hashflags/OlympicFlameEmoji/OlympicFlameEmoji.png'
    );
  });

  it('Should have activeHashflags map available', () => {
    expect(hashflags.activeHashflags).not.toBeUndefined();
  });

  it('Should contain hashtag', () => {
    expect(hashflags.activeHashflags.has('olympictorchrelay')).toBeTruthy();
    expect(hashflags.activeHashflags.get('olympictorchrelay')).toEqual(
      olympicTorchURL
    );
  });

  it('Should get hashtag URL', () => {
    expect(hashflags.getUrl('olympictorchrelay')).toEqual(olympicTorchURL);
    expect(hashflags.getUrl('test')).toBeUndefined();
  });

  it('Should get hashtag URLs', () => {
    expect(hashflags.getUrls(['olympictorchrelay', 'test'])).toEqual([
      olympicTorchURL,
      undefined
    ]);
  });
});

interface IHashflagsJson {
  hashflagBaseUrl: string;
  activeHashflags: { [hashflag: string]: string };
}
