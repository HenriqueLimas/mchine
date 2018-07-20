import {Action} from '../Action';
import {Cond} from './../Schema/TransitionSchema';
import {ExternalData} from './../Schema/TransitionSchema/types';
import {OrderedSet} from '../DataTypes/OrderedSet';
import {StateID} from '../State';

// Event is what triggers the transition (currently a simple string)
export type Event = {
  name: string;
  data?: ExternalData;
};

// Transition between states triggered by events
export type Transition = {
  events: Event[];
  target: StateID[];
  source?: StateID;
  cond: Cond[];
  actions: Action[];
};

export type TransitionSet = OrderedSet<Transition>;
