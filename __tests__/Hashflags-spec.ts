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
  const tweet: string = 'I #love the #OlympicTorchRelay #성화봉송 so much!';

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
    expect(hashflags.activeHashflags.get('OlympicTorchRelay')).toBeUndefined();
  });

  it('Should get hashflag URL', () => {
    expect(hashflags.getUrl('#olympictorchrelay')).toEqual(olympicTorchURL);
    expect(hashflags.getUrl('#OlympicTorchRelay')).toEqual(olympicTorchURL);
    expect(hashflags.getUrl('#love')).toBeUndefined();
  });

  it('Should get hashflag URLs', () => {
    expect(
      hashflags.getUrls(['#olympictorchrelay', '#OlympicTorchRelay', '#love'])
    ).toEqual([olympicTorchURL, olympicTorchURL, undefined]);
  });

  it('Should check if hashflag is valid', () => {
    expect(hashflags.isValidHashflag('#olympictorchrelay')).toBeTruthy();
    expect(hashflags.isValidHashflag('olympictorchrelay')).not.toBeTruthy();
    expect(hashflags.isValidHashflag('#OlympicTorchRelay')).toBeTruthy();
    expect(hashflags.isValidHashflag('#love')).not.toBeTruthy();
  });

  it('Should get hashflags with indices', () => {
    expect(hashflags.extractHashflagsWithIndices(tweet)).toHaveLength(2);
    expect(hashflags.extractHashflagsWithIndices(tweet)[0].hashtag).toEqual(
      'OlympicTorchRelay'
    );
    expect(hashflags.extractHashflagsWithIndices(tweet)[0].indices).toEqual([
      12,
      30
    ]);
    expect(hashflags.extractHashflagsWithIndices(tweet)[1].hashtag).toEqual(
      '성화봉송'
    );
    expect(hashflags.extractHashflagsWithIndices(tweet)[1].indices).toEqual([
      31,
      36
    ]);
  });

  it('Should get hashflags without indices', () => {
    expect(hashflags.extractHashflags(tweet)).toHaveLength(2);
    expect(hashflags.extractHashflags(tweet)[0]).toEqual('OlympicTorchRelay');
    expect(hashflags.extractHashflags(tweet)[1]).toEqual('성화봉송');
  });

  it('Should return correct HTML all hashflags in a tweet', () => {
    const entities: HashflagWithIndices[] = hashflags.extractHashflagsWithIndices(
      tweet
    );
    expect(hashflags.autoLinkHashflag(tweet, entities)).toEqual(
      'I #love the #OlympicTorchRelay<img src="https://abs.twimg.com/hashflags/OlympicFlameEmoji/OlympicFlameEmoji.png" class="tweet-url' +
        ' hashflag" alt="OlympicTorchRelay"> #성화봉송<img src="https://abs.twimg.com/hashflags/OlympicFlameEmoji/OlympicFlameEmoji.png" c' +
        'lass="tweet-url hashflag" alt="성화봉송"> so much!'
    );
    expect(hashflags.autoLinkHashflag(tweet, entities, true)).toEqual(
      'I #love the #OlympicTorchRelay<img src="https://abs.twimg.com/hashflags/OlympicFlameEmoji/OlympicFlameEmoji.png" class="tweet-url' +
        ' hashflag" alt="OlympicTorchRelay" style="height:1.25em;width:1.25em;padding:0 .05em 0 .1em;vertical-align:-0.2em"> #성화봉송<img' +
        ' src="https://abs.twimg.com/hashflags/OlympicFlameEmoji/OlympicFlameEmoji.png" class="tweet-url hashflag" alt="성화봉송" style="h' +
        'eight:1.25em;width:1.25em;padding:0 .05em 0 .1em;vertical-align:-0.2em"> so much!'
    );
  });

  it('Should return correct HTML all entities in a tweet', () => {
    expect(hashflags.autoLink(tweet)).toEqual(
      'I <a href="https://twitter.com/search?q=%23love" title="#love" class="tweet-url hashtag" rel="nofollow">#love</a> the <a href="ht' +
        'tps://twitter.com/search?q=%23OlympicTorchRelay" title="#OlympicTorchRelay" class="tweet-url hashtag" rel="nofollow">#OlympicTo' +
        'rchRelay</a><img src="https://abs.twimg.com/hashflags/OlympicFlameEmoji/OlympicFlameEmoji.png" class="tweet-url hashflag" alt="' +
        'OlympicTorchRelay"> <a href="https://twitter.com/search?q=%23성화봉송" title="#성화봉송" class="tweet-url hashtag" rel="nofollow">#' +
        '성화봉송</a><img src="https://abs.twimg.com/hashflags/OlympicFlameEmoji/OlympicFlameEmoji.png" class="tweet-url hashflag" alt="성' +
        '화봉송"> so much!'
    );
    expect(hashflags.autoLink(tweet, true)).toEqual(
      'I <a href="https://twitter.com/search?q=%23love" title="#love" class="tweet-url hashtag" rel="nofollow">#love</a> the <a href="h' +
        'ttps://twitter.com/search?q=%23OlympicTorchRelay" title="#OlympicTorchRelay" class="tweet-url hashtag" rel="nofollow">#OlympicT' +
        'orchRelay</a><img src="https://abs.twimg.com/hashflags/OlympicFlameEmoji/OlympicFlameEmoji.png" class="tweet-url hashflag" alt=' +
        '"OlympicTorchRelay" style="height:1.25em;width:1.25em;padding:0 .05em 0 .1em;vertical-align:-0.2em"> <a href="https://twitter.c' +
        'om/search?q=%23성화봉송" title="#성화봉송" class="tweet-url hashtag" rel="nofollow">#성화봉송</a><img src="https://abs.twimg.com/hash' +
        'flags/OlympicFlameEmoji/OlympicFlameEmoji.png" class="tweet-url hashflag" alt="성화봉송" style="height:1.25em;width:1.25em;paddin' +
        'g:0 .05em 0 .1em;vertical-align:-0.2em"> so much!'
    );
  });
});

interface IHashflagsJson {
  activeHashflags: { [hashflag: string]: string };
}
