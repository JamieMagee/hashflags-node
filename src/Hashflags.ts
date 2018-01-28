import axios, { AxiosResponse } from 'axios';
import { extractHashtagsWithIndices, HashtagWithIndices } from 'twitter-text';
import { URL } from 'url';

/**
 * A library for using Twitter hashflags in the browser and Node.js
 */
export class Hashflags {
  public activeHashflags: Map<string, URL>;

  constructor(activeHashflags: Map<string, URL>) {
    this.activeHashflags = activeHashflags;
  }

  public static async FETCH(): Promise<Map<string, URL>> {
    const activeHashflags: Map<string, URL> = new Map();

    await axios
      .get('https://hashflags.jamiemagee.co.uk/json/activeHashflags')
      .then((response: AxiosResponse<HashflagsJson>) => {
        Object.keys(response.data.activeHashflags).forEach((key: string) => {
          activeHashflags.set(
            key,
            new URL(
              response.data.hashflagBaseUrl + response.data.activeHashflags[key]
            )
          );
        });
      });

    return activeHashflags;
  }

  /**
   * Returns the hashflag URL for a single hashtag.
   * @param hashtag The hashtag you wish to retrieve the hashflag URL for.
   * @returns A URL object or undefined
   */
  public getUrl(hashtag: string): URL | undefined {
    return this.activeHashflags.get(hashtag);
  }

  /**
   * Returns the hashflag URLs for an array of hashtags
   * @param hashtags an array of hashtags you wish to retrieve the hashflag URLs for
   * @returns An array of URL objects or undefined
   */
  public getUrls(hashtags: string[]): (URL | undefined)[] {
    return hashtags.map((ht: string) => this.activeHashflags.get(ht));
  }

  /**
   * Takes the text of a tweet, and returns an array of hashflags along with the
   * associated start and end position.
   * @param text A tweet
   */
  public extractHashflagsWithIndices(text: string): HashflagWithIndices[] {
    const hashtags: HashtagWithIndices[] = extractHashtagsWithIndices(text);
    const hashflags: HashflagWithIndices[] = [];
    hashtags.forEach((value: HashtagWithIndices) => {
      if (this.activeHashflags.has(value.hashtag)) {
        hashflags.push({
          hashflag: value.hashtag,
          indices: value.indices
        });
      }
    });

    return hashflags;
  }
}

export interface HashflagWithIndices {
  hashflag: string;
  indices: [number, number];
}

interface HashflagsJson {
  hashflagBaseUrl: string;
  activeHashflags: { [hashflag: string]: string };
}
