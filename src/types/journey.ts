export enum StepType {
  USER_NAME = 'UserName',
  PASSWORD = 'Password',
  METADATA = 'Metadata',
  CHOICE = 'Choice',
}

export interface ClientInput {
  id: string;
  step_type: StepType;
  type: string;
  send_back: boolean;
  output: Record<string, any>;
  input: any;
}

export interface JourneyRequest {
  journey_id?: string;
  journey_token?: string;
  client_inputs?: ClientInput[];
}

export interface JourneyResponsePayload {
  journey_token: string;
  client_inputs: ClientInput[];
  client_error?: {
    error: string;
    details?: Record<string, any>;
  };
}

export interface JourneySuccess {
  session_id?: string;
  success_url?: string;
}

export interface JourneyFailure {
  error: string;
  failure_url?: string;
}
