import axios, { AxiosResponse } from 'axios';
import { URL } from 'url';

/**
 *
 */
export class Hashflags {
  // tslint:disable-next-line:variable-name
  private _activeHashflags: Map<string, URL>;

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
      .get('https://hashflags.blob.core.windows.net/json/activeHashflags')
      .then((response: AxiosResponse<IHashflagsJson>) => {
        this._activeHashflags = new Map();
        Object.keys(response.data.activeHashflags).forEach((key: string) => {
          this._activeHashflags.set(
            key,
            new URL(
              response.data.hashflagBaseUrl + response.data.activeHashflags[key]
            )
          );
        });
      });
  }

  /**
   * Get a map of all the current active hashflags, and full URL to their image.
   * @returns Map from hashtag to hashflag image
   */
  public get activeHashflags(): Map<string, URL> {
    return this._activeHashflags;
  }
}

interface IHashflagsJson {
  hashflagBaseUrl: string;
  activeHashflags: { [hashflag: string]: string };
}
