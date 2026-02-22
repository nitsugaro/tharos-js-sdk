import { BasicTharosContext, type TharosImpl } from '../tharos.js';
import type { ClientInput } from '../types/journey.js';

export class JourneyStepType extends BasicTharosContext {
  private clientInput: ClientInput;
  public static readonly stepsMap: Map<string, typeof JourneyStepType> = new Map();

  constructor(clientInput: ClientInput, ctx: TharosImpl) {
    super(ctx);

    this.clientInput = clientInput;
  }

  public getID() {
    return this.clientInput.id;
  }

  public getStepType() {
    return this.clientInput.step_type;
  }

  public getType() {
    return this.clientInput.type;
  }

  public setInput(data: any) {
    this.clientInput.input = data;
  }

  public getOutput() {
    return this.clientInput.output;
  }

  public getPayload() {
    return this.clientInput;
  }
}
