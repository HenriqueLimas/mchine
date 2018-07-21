import {Event} from '../Event/types';

import {Action} from '../Action';
import {Cond} from './../Schema/TransitionSchema';
import {OrderedSet} from '../DataTypes/OrderedSet';
import {StateID} from '../State';

// Transition between states triggered by events
export type Transition = {
  events: Event[];
  target: StateID[];
  source?: StateID;
  cond: Cond[];
  actions: Action[];
};

export type TransitionSet = OrderedSet<Transition>;
