import axios from 'axios';
import * as MockAdapter from 'axios-mock-adapter';
import * as fs from 'fs';
import { URL } from 'url';
import { Hashflags, HashflagWithIndices } from '../src/Hashflags';

/**
 * Tests for the Hashflags class
 */

describe('Test', () => {
  let hashflags: Hashflags;
  let olympicTorchURL: string;
  const tweet: string = 'I #love the #olympictorchrelay so much!';

  beforeAll(async () => {
    const mock: MockAdapter = new MockAdapter(axios);
    const mockData: IHashflagsJson = JSON.parse(
      fs.readFileSync('./__tests__/activeHashflags.json', 'utf8')
    );
    mock.onGet(new RegExp('.*')).reply(200, mockData);
    hashflags = await Hashflags.FETCH().then((val: Map<string, string>) => {
      return new Hashflags(val);
    });

    olympicTorchURL =
      'https://abs.twimg.com/hashflags/OlympicFlameEmoji/OlympicFlameEmoji.png';
  });

  it('Should have activeHashflags map available', () => {
    expect(hashflags.activeHashflags).not.toBeUndefined();
  });

  it('Should contain hashflag', () => {
    expect(hashflags.activeHashflags.has('olympictorchrelay')).toBeTruthy();
    expect(hashflags.activeHashflags.get('olympictorchrelay')).toEqual(
      olympicTorchURL
    );
  });

  it('Should get hashflag URL', () => {
    expect(hashflags.getUrl('#olympictorchrelay')).toEqual(olympicTorchURL);
    expect(hashflags.getUrl('#love')).toBeUndefined();
  });

  it('Should get hashflag URLs', () => {
    expect(hashflags.getUrls(['#olympictorchrelay', '#love'])).toEqual([
      olympicTorchURL,
      undefined
    ]);
  });

  it('Should check if hashflag is valid', () => {
    expect(hashflags.isValidHashflag('#olympictorchrelay')).toBeTruthy();
    expect(hashflags.isValidHashflag('olympictorchrelay')).not.toBeTruthy();
    expect(hashflags.isValidHashflag('#love')).not.toBeTruthy();
  });

  it('Should get hashflags with indices', () => {
    expect(hashflags.extractHashflagsWithIndices(tweet)).toHaveLength(1);
    expect(hashflags.extractHashflagsWithIndices(tweet)[0].hashtag).toEqual(
      'olympictorchrelay'
    );
    expect(hashflags.extractHashflagsWithIndices(tweet)[0].indices).toEqual([
      12,
      30
    ]);
  });

  it('Should get hashflags without indices', () => {
    expect(hashflags.extractHashflags(tweet)).toHaveLength(1);
    expect(hashflags.extractHashflags(tweet)[0]).toEqual('olympictorchrelay');
  });

  it('Should return correct HTML all hashflags in a tweet', () => {
    const entities: HashflagWithIndices[] = hashflags.extractHashflagsWithIndices(
      tweet
    );
    expect(hashflags.autoLinkHashflag(tweet, entities)).toEqual(
      'I #love the #olympictorchrelay<img src="https://abs.twimg.com/hashflags/OlympicFlameEmoji/OlympicFlameEmoji.png" class="tweet-url' +
        ' hashflag" alt="olympictorchrelay"> so much!'
    );
  });

  it('Should return correct HTML all entities in a tweet', () => {
    expect(hashflags.autoLink(tweet)).toEqual(
      'I <a href="https://twitter.com/search?q=%23love" title="#love" class="tweet-url hashtag" rel="nofollow">#love</a> the <a href="ht' +
        'tps://twitter.com/search?q=%23olympictorchrelay" title="#olympictorchrelay" class="tweet-url hashtag" rel="nofollow">#olympicto' +
        'rchrelay</a><img src="https://abs.twimg.com/hashflags/OlympicFlameEmoji/OlympicFlameEmoji.png" class="tweet-url hashflag" alt="' +
        'olympictorchrelay"> so much!'
    );
  });
});

interface IHashflagsJson {
  hashflagBaseUrl: string;
  activeHashflags: { [hashflag: string]: string };
}
