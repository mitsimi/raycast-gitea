import { Label } from "./issue-label";
import { Milestone } from "./issue-milestone";
import { User } from "./user";

export enum StateType {
  Open = "open",
  Closed = "closed",
  All = "all",
  Merged = "merged",
}

export interface Issue {
  id: number;
  url: string;
  html_url: string;
  number: number;
  user: User | null;
  original_author: string;
  original_author_id: number;
  title: string;
  body: string;
  ref: string;
  //assets: Attachment[]; // Attachments
  labels: Label[];
  milestone: Milestone | null;
  assignees: User[];
  /**
   * Whether the issue is open or closed
   * enum: open,closed
   */
  state: StateType;
  is_locked: boolean;
  comments: number;
  /**
   * ISO string for created date-time
   */
  created_at: string;
  /**
   * ISO string for updated date-time
   */
  updated_at: string;
  /**
   * ISO string for closed date-time, or null
   */
  closed_at: string | null;
  /**
   * ISO string for due date, or null
   */
  due_date: string | null;

  time_estimate: number;

  pull_request: PullRequestMeta | null;
  repository: RepositoryMeta | null;

  pin_order: number;
}

// PullRequestMeta PR info if an issue is a PR
export interface PullRequestMeta {
  hasMerged: boolean;
  merged: string | null; // ISO date string or null
  isWorkInProgress: boolean;
  html_url: string;
}

// RepositoryMeta basic repository information
export interface RepositoryMeta {
  id: number;
  name: string;
  owner: string;
  full_name: string;
}
