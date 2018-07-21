import {OrderedSet} from './../DataTypes/OrderedSet';
import {StateID} from './types';
import {Action} from './../Action';
import {Transition} from './../Transition';

// StateID represent the id of the state
export type StateID = string;

// InitialState a string to represent what is the initial state
export type InitialState = string;

// PseudoState currently only the InitialState
export type PseudoState = InitialState;

// AtomicState a leaf state without no children
export type AtomicState = {
  id: StateID;
  parentId: StateID;
  transitions: Transition[];
  onEntry: Action[];
  onExit: Action[];
};

// StateNode a state with children
export type StateNode = AtomicState & {
  initial: InitialState;
  states: Record<string, StateID>;
};

// ParallelState a state with multiple states value at the same time
export type ParallelState = AtomicState & {
  parallel: boolean;
  states: Record<string, StateID>;
};

// State represents the differnt types of states
export type CompoundState = StateNode | ParallelState;

// State represents the differnt types of states
export type State = StateNode | ParallelState | AtomicState;

export type StateSet = OrderedSet<State>;

export type StateHash = Record<StateID, State>;

export type CurrentAtomicState = string;
export type CurrentCompoundState = Record<string, CurrentAtomicState>;

export type CurrentStateNode = CurrentAtomicState | CurrentCompoundState;
export type CurrentState =
  | CurrentAtomicState
  | Record<StateID, CurrentStateNode>;
