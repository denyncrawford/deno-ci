export interface GithubPayload {
  ref?: string;
  repository: {
    name: string;
    default_branch: string;
    svn_url: string;
  };
  sender: {
    login: string;
  };
}

export interface GithubData {
  user: string;
  repository: string;
  url: string;
}