import { BasicTharosContext, type TharosImpl } from '../tharos.js';
import type { Tokens } from '../types/tokens.js';

export class UserTokens extends BasicTharosContext {
  private tokens: Tokens;

  constructor(tokens: Tokens, tharosCtx: TharosImpl) {
    super(tharosCtx);

    this.tokens = tokens;
  }

  public getSessionID() {
    return this.tokens.session_id;
  }

  public async userInfo(): Promise<Map<string, any>> {
    const claims = await this.ctx.api.get<Map<string, any>>(this.ctx.config.oidc.userinfo_endpoint, {
      overrideUrl: true,
    });
    return claims;
  }

  public getAccessToken() {
    return this.tokens.access_token;
  }

  /**
   * Get claims for the current access token, if its a JWT extracts claims from encoded payload, otherwhise makes a call to /userinfo endpoint.
   */
  public async getAccessTokenClaims(): Promise<Map<string, any>> {
    return this.getAccessToken()?.split('.').length === 3 ? this.getClaimsFromJWT() : this.userInfo();
  }

  private getClaimsFromJWT(): Map<string, any> {
    const payload = this.getAccessToken()?.split('.')[1]!;
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const bin = atob(base64);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  }

  public getIDToken() {
    return this.tokens.id_token;
  }

  public getRefreshToken() {
    return this.tokens.refresh_token;
  }

  public async refreshTokens(): Promise<boolean> {
    if (!this.tokens.refresh_token) {
      return false;
    }

    return true;
  }
}
