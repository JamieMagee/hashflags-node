import axios, { AxiosResponse } from 'axios';
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
      .then((response: AxiosResponse<IHashflagsJson>) => {
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
}

interface IHashflagsJson {
  hashflagBaseUrl: string;
  activeHashflags: { [hashflag: string]: string };
}
