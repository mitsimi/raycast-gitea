export interface Label {
  /** ID is the unique identifier for the label */
  id: number;
  /** Name is the display name of the label */
  name: string;
  /** example: false */
  exclusive: boolean;
  /** example: false */
  is_archived: boolean;
  /** example: 00aabb */
  color: string;
  /** Description provides additional context about the label's purpose */
  description: string;
  /** URL is the API endpoint for accessing this label */
  url: string;
}
