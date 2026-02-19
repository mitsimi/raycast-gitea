import type { components } from "./gitea";

export type Schemas = components["schemas"];

export type Repository = Schemas["Repository"];
export type Issue = Schemas["Issue"];
export type User = Schemas["User"];
export type Label = Schemas["Label"];
export type Milestone = Schemas["Milestone"];
export type Organization = Schemas["Organization"];
export type NotificationThread = Schemas["NotificationThread"];
export type NotificationSubject = Schemas["NotificationSubject"];
export type PullRequestMeta = Schemas["PullRequestMeta"];
export type RepositoryMeta = Schemas["RepositoryMeta"];
export type SearchResults = Schemas["SearchResults"];
export type StateType = Schemas["StateType"];
export type NotifySubjectType = Schemas["NotifySubjectType"];

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
