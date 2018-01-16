import axios, { AxiosResponse } from 'axios';
import { URL } from 'url';

/**
 *
 */
export class Hashflags {
  // tslint:disable-next-line:variable-name
  private _baseUrl: URL;
  // tslint:disable-next-line:variable-name
  private _activeHashflags: Map<string, string>;

  public async fetch(): Promise<void> {
    // tslint:disable-next-line:no-backbone-get-set-outside-model
    await axios
      .get('https://hashflags.blob.core.windows.net/json/activeHashflags')
      .then((response: AxiosResponse<IHashflagsJson>) => {
        this._baseUrl = new URL(response.data.hashflagBaseUrl);
        this._activeHashflags = new Map();
        Object.keys(response.data.activeHashflags).forEach((key: string) => {
          this._activeHashflags.set(key, response.data.activeHashflags[key]);
        });
      });
  }

  public get baseUrl(): URL {
    return this._baseUrl;
  }

  public get activeHashflags(): Map<string, string> {
    return this._activeHashflags;
  }
}

export interface IHashflagsJson {
  hashflagBaseUrl: string;
  activeHashflags: { [hashflag: string]: string };
}
