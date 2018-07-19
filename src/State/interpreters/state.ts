import {CompoundState, ParallelState, State, StateNode} from '../types';
import {
  CompoundStateSchema,
  isCompoundStateSchema,
  isParallelStateSchema,
  StateSchema,
} from '../../Schema/StateSchema';
import {newTransactionFromEventSchema} from './transaction';
import {concatStateIDs} from '../state';

export function newStateFromSchema(
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
        [concatStateIDs(state.id, childStateId)]: concatStateIDs(
          state.id,
          childStateId
        ),
      }),
      {}
    );
    if (isParallelStateSchema(stateSchema)) {
      (<ParallelState>state).parallel = true;
    } else {
      (<StateNode>state).initial = concatStateIDs(
        state.id,
        stateSchema.initial
      );
    }
  }
  if (stateSchema.events) {
    state.transitions = Object.keys(stateSchema.events).map((eventName) => {
      const eventSchema = stateSchema.events[eventName];
      return newTransactionFromEventSchema(stateSchema.events[eventName], {
        events: [eventName],
        source: state.id,
        target: [eventSchema.target],
        cond: eventSchema.cond,
      });
    });
  }
  return state;
}
