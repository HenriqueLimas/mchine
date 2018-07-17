import {Cond} from './../Schema/TransitionSchema';
import {StateID} from '../State';
import {OrderedSet} from '../DataTypes/OrderedSet';

// Event is what triggers the transition (currently a simple string)
export type Event = string;

// Transition between states triggered by events
export type Transition = {
  events: Event[];
  target: StateID[];
  source?: StateID;
  cond: Cond[];
};

export type TransitionSet = OrderedSet<Transition>;
