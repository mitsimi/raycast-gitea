export interface RepositorySearchResponse {
  ok: boolean;
  data: Repository[];
}

export interface Repository {
  id: string;
  owner: RepositoryOwner;
  full_name: string;
  description: string;
  html_url: string;
  language: string;
  stars_count: number;
  starsCount: string;
  forks_count: number;
  avatar_url: string;
}

export interface RepositoryOwner {
  id: string;
  username: string;
  avatar_url: string;
  html_url: string;
}
