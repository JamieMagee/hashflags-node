import axios, { AxiosResponse } from 'axios';
import { URL } from 'url';

/**
 *
 */
export class Hashflags {
  public activeHashflags: Map<string, URL>;

  private constructor() {}

  /**
   * A static constructor for the Hashflags class.
   * This is necessary as we need to make an API call to populate the list of active hashflags.
   * @returns A Hashflags instance.
   */
  public static async CREATE(): Promise<Hashflags> {
    const clazz: Hashflags = new Hashflags();
    await clazz.initialize();

    return clazz;
  }

  public async initialize(): Promise<void> {
    await axios
      .get('https://hashflags.jamiemagee.co.uk/json/activeHashflags')
      .then((response: AxiosResponse<IHashflagsJson>) => {
        this.activeHashflags = new Map();
        Object.keys(response.data.activeHashflags).forEach((key: string) => {
          this.activeHashflags.set(
            key,
            new URL(
              response.data.hashflagBaseUrl + response.data.activeHashflags[key]
            )
          );
        });
      });
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
