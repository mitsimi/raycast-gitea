export interface RepositorySearchResponse {
  ok: boolean;
  data: Repository[];
}

export interface Repository {
  id: string;
  owner: User;
  full_name: string;
  description: string;
  avatar_url: string;
  clone_url: string;
  html_url: string;
  language: string;
  stars_count: number;
  forks_count: number;
  updated_at: string;
  created_at: string;
  archived: boolean;
}
