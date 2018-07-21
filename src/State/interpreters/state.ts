import {RootSchema} from './../../Schema/StateSchema/types';
import {
  CompoundState,
  ParallelState,
  State,
  StateNode,
  AtomicState,
  RootState,
} from '../types';
import {
  CompoundStateSchema,
  isCompoundStateSchema,
  isParallelStateSchema,
  StateSchema,
} from '../../Schema/StateSchema';
import {newTransactionFromEventSchema} from './transaction';
import {concatStateIDs} from '../state';
import {isRootState} from '../typeGards';

export function newStateFromSchema(
  stateSchema: StateSchema,
  partialState: Partial<State>
): State {
  let state: State = {
    id: partialState.id,
    onEntry: stateSchema.onEntry || [],
    onExit: stateSchema.onExit || [],
    parentId: (<AtomicState>partialState).parentId,
    transitions: [],
  };

  if (isRootState(state) && isCompoundStateSchema(stateSchema)) {
    (<RootState>state).states = Object.keys(<RootSchema>(
      stateSchema.states
    )).reduce(
      (states, stateID) => ({
        ...states,
        [stateID]: stateID,
      }),
      {}
    );

    state.initial = (<RootSchema>stateSchema).initial;
    state.parallel = (<RootSchema>stateSchema).parallel;

    return state;
  }

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
        events: [{name: eventName}],
        source: state.id,
        target: [eventSchema.target],
        cond: eventSchema.cond,
      });
    });
  }
  return state;
}
