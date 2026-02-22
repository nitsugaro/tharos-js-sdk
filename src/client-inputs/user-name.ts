import { StepType } from '../types/journey.js';
import { JourneyStepType } from './client-input.js';

export class UserNameInput extends JourneyStepType {
  public getPattern(): string | undefined {
    return this.getOutput().pattern;
  }

  public getPrompt(): string | undefined {
    return this.getOutput().prompt;
  }

  public getRequired(): boolean {
    return !!this.getOutput().required;
  }

  public setInput(userName: string) {
    super.setInput(userName);
  }
}

JourneyStepType.stepsMap.set(StepType.USER_NAME, UserNameInput);
