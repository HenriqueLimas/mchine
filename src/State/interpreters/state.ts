import {CompoundState, ParallelState, State, StateNode} from '../types';
import {
  CompoundStateSchema,
  isCompoundStateSchema,
  isParallelStateSchema,
  StateSchema,
} from '../../Schema/StateSchema';
import {NewTransactionFromEventSchema} from './transaction';

export function NewStateFromSchema(
  stateSchema: StateSchema,
  partialState: Partial<State>
): State {
  let state: State = {
    id: partialState.id,
    parentId: partialState.parentId,
    transitions: [],
    onEntry: stateSchema.onEntry || [],
    onExit: stateSchema.onExit || [],
  };
  if (isCompoundStateSchema(stateSchema)) {
    (<CompoundState>state).states = Object.keys(
      (<CompoundStateSchema>stateSchema).states
    ).reduce(
      (states, childStateId) => ({
        ...states,
        [`${state.id}.${childStateId}`]: `${state.id}.${childStateId}`,
      }),
      {}
    );
    if (isParallelStateSchema(stateSchema)) {
      (<ParallelState>state).parallel = true;
    } else {
      (<StateNode>state).initial = `${state.id}.${stateSchema.initial}`;
    }
  }
  if (stateSchema.events) {
    state.transitions = Object.keys(stateSchema.events).map((eventName) => {
      const eventSchema = stateSchema.events[eventName];
      return NewTransactionFromEventSchema(stateSchema.events[eventName], {
        events: [eventName],
        source: state.id,
        target: [eventSchema.target],
        cond: eventSchema.cond,
      });
    });
  }
  return state;
}
