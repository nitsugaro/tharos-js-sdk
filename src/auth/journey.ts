import { BasicTharosContext, type TharosImpl } from '../tharos.js';
import type {
  ClientInput,
  JourneyFailure,
  JourneyRequest,
  JourneyResponsePayload,
  JourneySuccess,
  StepType,
} from '../types/journey.js';
import { JourneyStepType } from '../client-inputs/client-input.js';

export class JourneyResponse extends BasicTharosContext {
  private journeyResponsePayload: JourneyResponsePayload;
  private clientInputs: JourneyStepType[];

  constructor(journeyResponsePayload: JourneyResponsePayload, ctx: TharosImpl) {
    super(ctx);

    this.journeyResponsePayload = journeyResponsePayload;
    this.clientInputs = this.journeyResponsePayload.client_inputs.map(
      (el) => new (JourneyStepType.stepsMap.get(el.step_type.toString())!)(el, ctx)
    );
  }

  public getJourneyToken() {
    return this.journeyResponsePayload.journey_token;
  }

  public getClientInputs<T extends JourneyStepType>(stepType: StepType): T[] {
    return this.clientInputs.filter((el) => el.getStepType() == stepType) as T[];
  }

  public getAllClientInputs() {
    return this.clientInputs;
  }
}

export class JourneyRequestProcess extends BasicTharosContext {
  public async start(
    payload: { journey_id: string } | { resume_id: string },
    executor: JourneyExecutor,
    options?: { headers?: Record<string, string>; params?: Record<string, string> }
  ) {
    let uri = `/realms/${this.ctx.config.realm}/journeys/auth`;
    if (options?.params) {
      uri +=
        '?' +
        Object.entries(options.params)
          .map((val) => val.join('='))
          .join('&');
    }

    let journeyResponse = await this.ctx.api.post<JourneyResponsePayload | JourneyFailure | JourneySuccess>(
      uri,
      payload,
      {
        headers: options?.headers as any,
      }
    );

    while (journeyResponse.hasOwnProperty('journey_token')) {
      journeyResponse = journeyResponse as JourneyResponsePayload;
      let process = new JourneyResponse(journeyResponse, this.ctx);
      await executor.onNewStep(process);

      journeyResponse = await this.ctx.api.post<JourneyResponsePayload | JourneyFailure | JourneySuccess>(uri, {
        journey_token: journeyResponse.journey_token,
        client_inputs: process.getAllClientInputs().map((el) => el.getPayload()),
      });
    }

    if (journeyResponse.hasOwnProperty('session_id')) {
      await this.ctx.setAuthenticatedUser();
      executor.onSuccess(journeyResponse as JourneySuccess);
    } else {
      executor.onFailure(journeyResponse as JourneyFailure);
    }
  }
}

export interface JourneyExecutor {
  onSuccess: (journeySuccess: JourneySuccess) => Promise<void>;
  onFailure: (journeyFailure: JourneyFailure) => Promise<void>;
  onNewStep: (journeyResponse: JourneyResponse) => Promise<void>;
}
