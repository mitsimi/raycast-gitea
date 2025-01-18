import { useFetch } from "@raycast/utils";
import { Notification } from "./interfaces/notification";

export class Gitea {
  private serverUrl: string;
  private apiBaseUrl = "/api/v1";

  private accessToken: string;

  constructor(url: string, token: string) {
    this.accessToken = token;
    this.serverUrl = url;
  }

  getUnreadNotifications(): Notification[] {
    const notifyUrl = this.serverUrl + this.apiBaseUrl + `/notifications?token=${this.accessToken}&limit=20&all=false`;

    const { isLoading, data } = useFetch<Notification[]>(notifyUrl);
    const dataArray = Array.isArray(data) ? data : [];

    return [];
  }
}
