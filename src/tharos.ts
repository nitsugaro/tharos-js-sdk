import type { JourneyRequestProcess } from './auth/journey.js';
import type { User } from './auth/user.js';
import type { TharosConfig } from './config.js';
import type { ApiClient } from './http.js';

export interface TharosImpl {
  config: TharosConfig;
  api: ApiClient;
  journey: JourneyRequestProcess;
  getCurrentUser(): User | null;
  setAuthenticatedUser(): Promise<void>;
}

export class BasicTharosContext {
  protected ctx: TharosImpl;

  constructor(tharosCtx: TharosImpl) {
    this.ctx = tharosCtx;
  }
}
