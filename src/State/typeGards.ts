import {CompoundState, State, AtomicState, ParallelState} from './types';

// isCompoundState check if the state has child(ren)
export function isCompoundState(state: State): state is CompoundState {
  return (<CompoundState>state).states !== undefined;
}

// isParallelState check if the state has child(ren)
export function isParallelState(state: State): state is ParallelState {
  return (<ParallelState>state).parallel !== undefined;
}

// isAtomicState check if the state doesn't have children
export function isAtomicState(state: State): state is AtomicState {
  return !isCompoundState(state);
}
