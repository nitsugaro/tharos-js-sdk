import { StepType } from '../../types/journey.js';
import { JourneyStepType } from './client-input.js';

export class MeatadataInput extends JourneyStepType {
  public setInput() {}
}

JourneyStepType.stepsMap.set(StepType.METADATA, MeatadataInput);
