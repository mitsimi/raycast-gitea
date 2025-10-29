import { StateType } from "./issue";

// Milestone represents a collection of issues on one repository
export interface Milestone {
  /** ID is the unique identifier for the milestone */
  id: number;
  /** Title is the title of the milestone */
  title: string;
  /** Description provides details about the milestone */
  description: string;
  /** State indicates if the milestone is open or closed */
  state: StateType;
  /** OpenIssues is the number of open issues in this milestone */
  open_issues: number;
  /** ClosedIssues is the number of closed issues in this milestone */
  closed_issues: number;
  /** ISO string for created date-time */
  created_at: string;
  /** ISO string for updated date-time, or null */
  updated_at: string | null;
  /** ISO string for closed date-time, or null */
  closed_at: string | null;
  /** ISO string for due date, or null */
  due_on: string | null;
}
