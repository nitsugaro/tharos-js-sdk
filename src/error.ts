export enum ErrorCode {
  INVALID_REQUEST = 'invalid_request',
  INVALID_CLIENT = 'invalid_client',
  INVALID_GRANT = 'invalid_grant',
  UNAUTHORIZED_CLIENT = 'unauthorized_client',
  ACCESS_DENIED = 'access_denied',
  INVALID_TOKEN = 'invalid_token',
  INVALID_TOKEN_FORMAT = 'invalid_token_format',
  CONSENT_REQUIRED = 'consent_required',
  POLICY_REQUIRED = 'policy_required',
  SERVER_ERROR = 'server_error',
  TEMPORARILY_UNAVAILABLE = 'temporarily_unavailable',
  NETWORK = 'network',
}

export class TharosError extends Error {
  private code: ErrorCode;
  private details: Map<string, any> | undefined;

  constructor(code: ErrorCode, message: string, details?: Map<string, any>, options?: ErrorOptions) {
    super(message, options);

    this.code = code;
    this.details = details;
  }

  getDetails() {
    return this.details;
  }

  getMessage() {
    return this.message;
  }

  getCode() {
    return this.code;
  }
}
