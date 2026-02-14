import { Color, Icon } from "@raycast/api";
import { IssueState, NotificationSubjectType } from "../types/api";
import type { NotificationThread } from "../types/api";

type IconResult = { source: string | Icon; tintColor?: Color };

export function getIssueIcon(state?: string): IconResult {
  const normalized = state?.toLowerCase();
  switch (normalized) {
    case IssueState.Open:
      return { source: "issue-open.svg", tintColor: Color.Green };
    case IssueState.Closed:
      return { source: "issue-closed.svg", tintColor: Color.Red };
    default:
      return { source: Icon.Dot, tintColor: Color.SecondaryText };
  }
}

export function getPullRequestIcon(state?: string, title?: string): IconResult {
  const normalized = state?.toLowerCase();
  switch (normalized) {
    case IssueState.Open:
      return isDraftTitle(title)
        ? { source: "pr-draft.svg", tintColor: Color.SecondaryText }
        : { source: "pr-open.svg", tintColor: Color.Green };
    case IssueState.Closed:
      return { source: "pr-closed.svg", tintColor: Color.Red };
    case IssueState.Merged:
      return { source: "pr-merged.svg", tintColor: Color.Purple };
    default:
      return { source: Icon.Dot, tintColor: Color.SecondaryText };
  }
}

export function getNotificationIcon(notification: NotificationThread): IconResult {
  const subject = notification.subject;
  if (!subject) return { source: Icon.Dot, tintColor: Color.SecondaryText };

  const subjectType = subject.type?.toLowerCase();
  const subjectState = subject.state?.toLowerCase();

  switch (subjectType) {
    case NotificationSubjectType.Issue:
      return getIssueIcon(subjectState);
    case NotificationSubjectType.Pull:
      return getPullRequestIcon(subjectState, subject.title);
    default:
      return { source: Icon.Dot, tintColor: Color.SecondaryText };
  }
}

function isDraftTitle(title?: string) {
  if (!title) return false;
  return /^\s*(\[\s*wip\s*\]|wip\b|draft\b)/i.test(title);
}
