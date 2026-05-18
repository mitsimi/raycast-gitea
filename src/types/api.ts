import type { components, operations } from "./gitea";

type Schemas = components["schemas"];
type Operation = operations[keyof operations];
type OperationParameters<TOperation extends Operation> = NonNullable<TOperation["parameters"]>;

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
export type QueryOf<TOperation extends keyof operations> = NonNullable<
  OperationParameters<operations[TOperation]>["query"]
>;
export type PathParamsOf<TOperation extends keyof operations> = NonNullable<
  OperationParameters<operations[TOperation]>["path"]
>;
export type RequestBodyOf<TOperation extends keyof operations> = operations[TOperation] extends {
  requestBody?: { content: { "application/json": infer TBody } };
}
  ? TBody
  : never;

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
