import { StepType } from '../types/journey.js';
import { JourneyStepType } from './client-input.js';

export class ChoiceInput extends JourneyStepType {
  public getDefaultChoice(): string | undefined {
    return this.getOutput().default_value || undefined;
  }

  public getChoices(): string[] {
    return this.getOutput().value as string[];
  }

  public setInput(choice: string) {
    super.setInput(choice);
  }
}

JourneyStepType.stepsMap.set(StepType.CHOICE, ChoiceInput);
