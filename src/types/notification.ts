import { Color, Icon } from "@raycast/api";
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

export function getNotificationIcon(notification: Notification) {
  switch (notification.subject.type) {
    case NotifySubjectType.Issue:
      switch (notification.subject.state) {
        case StateType.Open:
          return { source: "issue-open.svg", tintColor: Color.Green };
        case StateType.Closed:
          return { source: "issue-closed.svg", tintColor: Color.Red };
      }
      break;

    case NotifySubjectType.Pull:
      switch (notification.subject.state) {
        case StateType.Open:
          return notification.subject.title.startsWith("WIP")
            ? { source: "pr-draft.svg", tintColor: Color.SecondaryText }
            : { source: "pr-open.svg", tintColor: Color.Green };
        case StateType.Closed:
          return { source: "pr-open.svg", tintColor: Color.Red };
        case StateType.Merged:
          return { source: "pr-merged.svg", tintColor: Color.Purple };
      }
      break;
  }

  return { source: Icon.Bug, tintColor: Color.Red };
}
