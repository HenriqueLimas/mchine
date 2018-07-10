import { StateID } from '../State/types';

// Event is what triggers the transition (currently a simple string)
export type Event = string;

// Transition between states triggered by events
export type Transition = {
  event: Event[];
  target: StateID;
  source: StateID;
};