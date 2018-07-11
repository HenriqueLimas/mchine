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
};

// StateNode a state with children
export type StateNode = {
  id: StateID;
  initial: InitialState;
  states: Record<string, State>;
};

// ParallelState a state with multiple states value at the same time
export type ParallelState = {
  id: StateID;
  parallel: boolean;
  states: Record<string, State>;
};

// State represents the differnt types of states
export type CompoundState = StateNode | ParallelState;

// State represents the differnt types of states
export type State = StateNode | ParallelState | AtomicState;