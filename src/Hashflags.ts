import axios, { AxiosResponse } from 'axios';
import {
  autoLink,
  AutoLinkOptions,
  extractHashtags,
  extractHashtagsWithIndices,
  HashtagWithIndices,
  isValidHashtag
} from 'twitter-text';

/**
 * A library for using Twitter hashflags in the browser and Node.js
 */
export class Hashflags {
  public readonly activeHashflags: Map<string, string>;
  private readonly DEFAULT_HASHFLAG_CLASS: string = 'tweet-url hashflag';

  constructor(activeHashflags: Map<string, string>) {
    this.activeHashflags = activeHashflags;
  }

  public static async FETCH(): Promise<Map<string, string>> {
    const activeHashflags: Map<string, string> = new Map();

    await axios
      .get('https://hashflags.jamiemagee.co.uk/json/activeHashflags')
      .then((response: AxiosResponse<HashflagsJson>) => {
        Object.keys(response.data.activeHashflags).forEach((key: string) => {
          activeHashflags.set(
            key,
            response.data.hashflagBaseUrl + response.data.activeHashflags[key]
          );
        });
      });

    return activeHashflags;
  }

  /**
   * Returns the hashflag URL for a single hashtag.
   * The hashtag parameter should include the # symbol.
   * @param hashtag The hashtag you wish to retrieve the hashflag URL for.
   * @returns A URL object or undefined
   */
  public getUrl(hashtag: string): string | undefined {
    const extracted: string = extractHashtags(hashtag)[0];

    return this.activeHashflags.get(extracted.toLowerCase());
  }

  /**
   * Returns the hashflag URLs for an array of hashtags
   * The hashtags parameter should include the # symbol
   * @param hashtags an array of hashtags you wish to retrieve the hashflag URLs for
   * @returns An array of URL objects or undefined
   */
  public getUrls(hashtags: string[]): (string | undefined)[] {
    return hashtags.map((ht: string) => this.getUrl(ht));
  }

  /**
   * Takes the text of a tweet, and returns an array of hashflags along with the
   * associated start and end position.
   * @param text The text of a tweet.
   */
  public extractHashflagsWithIndices(text: string): HashflagWithIndices[] {
    const hashtags: HashtagWithIndices[] = extractHashtagsWithIndices(text);
    const hashflags: HashflagWithIndices[] = [];
    hashtags.forEach((value: HashtagWithIndices) => {
      const lowercaseHashtag: string = value.hashtag.toLowerCase();
      if (this.activeHashflags.has(lowercaseHashtag)) {
        hashflags.push({
          hashtag: value.hashtag,
          url: this.activeHashflags.get(lowercaseHashtag),
          indices: value.indices
        });
      }
    });

    return hashflags;
  }

  /**
   * Takes the text of a tweet, and returns an array of hashflags
   * @param text The text of a tweet.
   */
  public extractHashflags(text: string): string[] {
    const hashtags: string[] = extractHashtags(text);
    const hashflags: string[] = [];
    hashtags.forEach((value: string) => {
      if (this.activeHashflags.has(value.toLowerCase())) {
        hashflags.push(value);
      }
    });

    return hashflags;
  }

  /**
   * Checks if a hashtag currently has an active hashflag.
   * The hashtag parameter should include the # symbol.
   * @param hashtag The hashtag you wish to check.
   */
  public isValidHashflag(hashtag: string): boolean {
    const extracted: string = extractHashtags(hashtag)[0];

    return (
      isValidHashtag(hashtag) &&
      this.activeHashflags.has(extracted.toLowerCase())
    );
  }

  /**
   * Returns the correct HTML for all possible entities in a tweet.
   * Includes: hashtags, cashtags, URLs, usernames, lists, and hashflags.
   * @param text The text of a tweet.
   */
  public autoLink(text: string): string {
    const entities: HashflagWithIndices[] = this.extractHashflagsWithIndices(
      autoLink(text)
    ).filter(
      (
        element: HashflagWithIndices,
        index: number,
        array: HashflagWithIndices[]
      ) => {
        return index % 2 === 1;
      }
    );

    return this.autoLinkHashflag(autoLink(text), entities);
  }

  /**
   * Returns the correct HTML for all hashflags entities in a tweet.
   * @param text The text of a tweet.
   * @param entities The hashflag entities to link.
   */
  public autoLinkHashflag(
    text: string,
    entities: HashflagWithIndices[]
  ): string {
    const textParts: string[] = [];
    let textClone: string = text;
    let previousHashtagEndIndex: number = 0;
    const linkClosingTag: string = '</a>';
    const closingTagLength: number = textClone.includes(linkClosingTag)
      ? linkClosingTag.length
      : 0;

    entities.forEach((element: HashflagWithIndices) => {
      const endOfHashtagIndex: number =
        element.indices[1] - previousHashtagEndIndex + closingTagLength;
      textParts.push(textClone.substring(0, endOfHashtagIndex));
      textParts.push(this.generateHashflagLink(element));
      textClone = textClone.substring(endOfHashtagIndex);
      previousHashtagEndIndex = endOfHashtagIndex;
    });

    textParts.push(textClone);

    return textParts.join('');
  }

  private generateHashflagLink(hashflag: HashflagWithIndices): string {
    return `<img src="${hashflag.url}" class="${
      this.DEFAULT_HASHFLAG_CLASS
    }" alt="${hashflag.hashtag}">`;
  }
}

export interface HashflagWithIndices {
  hashtag: string;
  url: string | undefined;
  indices: [number, number];
}

interface HashflagsJson {
  hashflagBaseUrl: string;
  activeHashflags: { [hashflag: string]: string };
}
