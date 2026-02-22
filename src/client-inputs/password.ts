import { StepType } from '../types/journey.js';
import { JourneyStepType } from './client-input.js';

export class PasswordInput extends JourneyStepType {
  public getPattern(): string | undefined {
    return this.getOutput().pattern;
  }

  public getPrompt(): string | undefined {
    return this.getOutput().prompt;
  }

  public getRequired(): boolean {
    return !!this.getOutput().required;
  }

  public setInput(password: string) {
    super.setInput(password);
  }
}

JourneyStepType.stepsMap.set(StepType.PASSWORD, PasswordInput);
