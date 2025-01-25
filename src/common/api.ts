import { getPreferenceValues } from "@raycast/api";
import { apiBaseUrl } from "./global";

export class APIBuilder {
  private serverUrl: string;
  private apiBaseUrl: string;
  private accessToken: string;

  private path: string = "";
  private queryArgs: Record<string, string> = {};

  constructor() {
    const { serverUrl, accessToken } = getPreferenceValues<{
      serverUrl: string;
      accessToken: string;
    }>();
    this.serverUrl = serverUrl;
    this.apiBaseUrl = apiBaseUrl;
    this.accessToken = accessToken;

    this.queryArgs = {
      token: this.accessToken,
    };
  }

  public setQueryArgs(args: Record<string, string>): APIBuilder {
    this.queryArgs = {
      ...this.queryArgs,
      ...args,
    };

    return this;
  }

  public setQueryArg(key: string, value: string): APIBuilder {
    this.queryArgs[key] = value;

    return this;
  }

  public setPath(path: string): APIBuilder {
    if (!path.startsWith("/")) {
      path = `/${path}`;
    }

    if (path.endsWith("/")) {
      path = path.slice(0, -1);
    }

    this.path += path;

    return this;
  }

  public build(): string {
    const url = this.serverUrl + this.apiBaseUrl + this.path;
    const queryString = new URLSearchParams(this.queryArgs).toString();
    return `${url}?${queryString}`;
  }
}
