import { Icon } from "@raycast/api";
import { StateType } from "./issue";
import { Repository } from "./repository";

export interface Notification {
  id: string;
  pinned: boolean;
  unread: boolean;
  repository: Repository;
  subject: NotificationSubject;
  url: string;
}

export interface NotificationSubject {
  title: string;
  html_url: string;
  type: NotifySubjectType;
  state: StateType;
}

export enum NotifySubjectType {
  Issue = "Issue",
  Pull = "Pull",
  Commit = "Commit",
  Repository = "Repository",
}
