import { BasicTharosContext } from '../tharos.js';
import type { UserTokens } from './tokens.js';

export class User extends BasicTharosContext {
  private tokens: UserTokens | null = null;

  public getUserTokens() {
    return this.tokens;
  }

  public async sessionInfo() {
    return await this.ctx.api.post<Record<string, string>>(`/realms/${this.ctx.config.realm}/session/info`);
  }

  public async validateSession(refresh: boolean = false) {
    return await this.ctx.api.post<Record<string, string>>(
      `/realms/${this.ctx.config.realm}/session/validate?refresh=${refresh}`
    );
  }
}
