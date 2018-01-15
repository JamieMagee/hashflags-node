import axios from "axios";
import { URL } from "url";

export class Hashflags {
  // tslint:disable-next-line:variable-name
  private _baseUrl: URL;
  // tslint:disable-next-line:variable-name
  private _activeHashflags: Array<{
    hashtag: string;
    path: string;
  }>;

  public async fetch() {
    await axios
      .get("https://hashflags.blob.core.windows.net/json/activeHashflags")
      .then(response => {
        this._baseUrl = new URL(response.data.hashflagBaseUrl);
        this._activeHashflags = response.data.activeHashflags;
      })
      .catch(e => {
        throw e;
      });
  }

  public get baseUrl(): URL {
    return this._baseUrl;
  }

  public get activeHashflags(): Array<{
    hashtag: string;
    path: string;
  }> {
    return this._activeHashflags;
  }
}
