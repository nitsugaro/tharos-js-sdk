import { JourneyRequestProcess, type JourneyExecutor } from './auth/journey.js';
import { User } from './auth/user.js';
import { TharosConfig } from './config.js';
import { ApiClient } from './http.js';
import type { Config, OAuth } from './types/config.js';
export * from './client-inputs/index';
export * from './types/index';
export * from './auth/index';
export * from './config';
export * from './error';
export * from './http';
export * from './tharos';

export class Tharos {
  public readonly config: TharosConfig;
  public readonly api: ApiClient;
  public readonly journey: JourneyRequestProcess;
  private defaultJourneyExecutor: JourneyExecutor | undefined;
  private user: User | null = null;

  constructor({ config, defaultJourneyExecutor }: { config: TharosConfig; defaultJourneyExecutor?: JourneyExecutor }) {
    this.config = config;
    this.api = new ApiClient(this.config.tharosAuthUrl);
    this.journey = new JourneyRequestProcess(this);
    this.defaultJourneyExecutor = defaultJourneyExecutor;

    const currentURL = new URL(window.location.href).origin + new URL(window.location.href).pathname;

    if (currentURL === this.config.oauth?.redirectUri) {
    }
  }

  public getDefaultJourneyExecutor() {
    return this.defaultJourneyExecutor;
  }

  public getCurrentUser() {
    return this.user;
  }

  public async setAuthenticatedUser() {
    const user = new User(this);

    await user.sessionInfo();
    this.user = user;
  }

  public getAuthorizeUrl(config?: OAuth): string {
    if (!config) {
      if (!this.config.oauth) {
        throw new Error('oauth not configured');
      }

      config = this.config.oauth;
    }

    return `${this.config.tharosAuthUrl}/realms/${this.config.realm}/oauth2/auth?client_id=${config.clientId}&scope=${config.scope}&response_type=code&redirect_uri=${config.redirectUri}&acr_values=all1`;
  }

  public async exchangeTokens() {
    const url = new URL(window.location.href);
    this.api.post(
      `/realms/${this.config.realm}/oauth2/token`,
      {
        grant_type: 'authorization_code',
        code: url.searchParams.get('code'),
        client_id: this.config.oauth?.clientId,
        scope: this.config.oauth?.scope,
      },
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
  }

  public static async newInstance(baseConfig: Config) {
    return new Tharos({ config: await TharosConfig.newInstance(baseConfig) });
  }
}
