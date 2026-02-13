import type { components } from "./gitea";

export type Repository = components["schemas"]["Repository"];
export type Issue = components["schemas"]["Issue"];
export type User = components["schemas"]["User"];
export type Label = components["schemas"]["Label"];
export type Milestone = components["schemas"]["Milestone"];
export type NotificationThread = components["schemas"]["NotificationThread"];
export type NotificationSubject = components["schemas"]["NotificationSubject"];
export type PullRequestMeta = components["schemas"]["PullRequestMeta"];
export type RepositoryMeta = components["schemas"]["RepositoryMeta"];
export type SearchResults = components["schemas"]["SearchResults"];
export type StateType = components["schemas"]["StateType"];
export type NotifySubjectType = components["schemas"]["NotifySubjectType"];

export const IssueState = {
  Open: "open",
  Closed: "closed",
  Merged: "merged",
} as const;

export type IssueState = (typeof IssueState)[keyof typeof IssueState];

export const NotificationSubjectType = {
  Issue: "issue",
  Pull: "pull",
  Commit: "commit",
  Repository: "repository",
} as const;

export type NotificationSubjectType = (typeof NotificationSubjectType)[keyof typeof NotificationSubjectType];
