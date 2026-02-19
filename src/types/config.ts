export interface OAuth {
  clientId: string;
  scope: string;
  redirectUri?: string;
}

export interface Config {
  tharosAuthUrl: string;
  realm: string;
  oauth: OAuth;
}
