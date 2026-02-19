import { StepType } from '../../types/journey.js';
import { JourneyStepType } from './client-input.js';

export class UserNameInput extends JourneyStepType {
  public setInput(userName: string) {
    super.setInput(userName);
  }
}

JourneyStepType.stepsMap.set(StepType.USER_NAME, UserNameInput);
