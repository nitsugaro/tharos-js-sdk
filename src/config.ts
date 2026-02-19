import { ApiClient } from './http.js';
import type { Config, OAuth } from './types/config.js';

export interface OpenIdConfiguration {
  issuer: string;

  authorization_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint: string;
  jwks_uri: string;
  registration_endpoint?: string;
  revocation_endpoint?: string;
  introspection_endpoint?: string;
  device_authorization_endpoint?: string;
  pushed_authorization_request_endpoint?: string;

  scopes_supported?: string[];
  response_types_supported: string[];
  response_modes_supported?: string[];
  grant_types_supported?: string[];

  subject_types_supported: ('public' | 'pairwise')[];
  id_token_signing_alg_values_supported: string[];
  id_token_encryption_alg_values_supported?: string[];
  id_token_encryption_enc_values_supported?: string[];

  userinfo_signing_alg_values_supported?: string[];
  userinfo_encryption_alg_values_supported?: string[];
  userinfo_encryption_enc_values_supported?: string[];

  request_object_signing_alg_values_supported?: string[];
  request_object_encryption_alg_values_supported?: string[];
  request_object_encryption_enc_values_supported?: string[];

  token_endpoint_auth_methods_supported?: string[];
  token_endpoint_auth_signing_alg_values_supported?: string[];

  introspection_endpoint_auth_methods_supported?: string[];
  introspection_endpoint_auth_signing_alg_values_supported?: string[];

  revocation_endpoint_auth_methods_supported?: string[];
  revocation_endpoint_auth_signing_alg_values_supported?: string[];

  claims_supported?: string[];
  claims_locales_supported?: string[];
  ui_locales_supported?: string[];

  claims_parameter_supported?: boolean;
  request_parameter_supported?: boolean;
  request_uri_parameter_supported?: boolean;
  require_request_uri_registration?: boolean;

  frontchannel_logout_supported?: boolean;
  frontchannel_logout_session_supported?: boolean;
  backchannel_logout_supported?: boolean;
  backchannel_logout_session_supported?: boolean;

  code_challenge_methods_supported?: ('plain' | 'S256')[];

  tls_client_certificate_bound_access_tokens?: boolean;
  authorization_response_iss_parameter_supported?: boolean;

  [key: string]: unknown;
}

export class TharosConfig {
  public readonly tharosAuthUrl: string;
  public readonly realm: string;
  public readonly oidc: OpenIdConfiguration;
  public readonly oauth: OAuth | undefined;

  constructor({ tharosAuthUrl, realm, oidc, oauth }: Config & { oidc: OpenIdConfiguration }) {
    this.tharosAuthUrl = tharosAuthUrl;
    this.realm = realm;
    this.oidc = oidc;
    this.oauth = oauth;
  }

  public static async newInstance(config: Config) {
    const api = new ApiClient('');

    const oidc = null as any;

    return new TharosConfig({ ...config, oidc });
  }
}
