import {EventSchema} from './../Schema/TransitionSchema/types';
import {Queue} from './../DataTypes/Queue';
import {StateHash, StateID, State} from './types';
import {StateMachineSchema} from './../Schema/StateSchema';
import {StateSchema, isParallelStateSchema} from './../Schema/StateSchema';
import {
  isCompoundStateSchema,
  CompoundStateSchema,
} from './../Schema/StateSchema';
import {Transition} from './../Transition/types';

export function schemaToState(
  stateMachineSchema: StateMachineSchema
): StateHash {
  const states = stateMachineSchema.states;
  const stateHash: StateHash = {};

  const queue = new Queue<StateID>(Object.keys(states));
  let parent: StateID = '';

  while (!queue.isEmpty()) {
    const current = queue.dequeue();
    const currentStateSchema = states[current];

    stateHash[current] = NewState(
      {
        id: current,
        parentId: parent || null,
      },
      currentStateSchema
    );
  }

  return stateHash;
}

export function NewState(
  partialState: Partial<State>,
  stateSchema: StateSchema
): State {
  let state: State = {
    id: [partialState.parentId, partialState.id].filter(Boolean).join('.'),
    parentId: partialState.parentId,
    transitions: [],
    onEntry: stateSchema.onEntry || [],
    onExit: stateSchema.onExit || [],
  };

  if (isCompoundStateSchema(stateSchema)) {
    state = {
      ...state,
      states: Object.keys((<CompoundStateSchema>stateSchema).states).reduce(
        (states, stateId) => ({
          ...states,
          [stateId]: state.id,
        }),
        {}
      ),
    };

    if (isParallelStateSchema(stateSchema)) {
      state = {
        ...state,
        parallel: true,
      };
    } else {
      state = {
        ...state,
        initial: stateSchema.initial,
      };
    }
  }

  if (stateSchema.events) {
    state.transitions = Object.keys(stateSchema.events)
      .map((eventName) => {
        const eventSchema = stateSchema.events[eventName];

        return NewTransactionFromEvent({
          events: [eventName],
          source: state.id,
          target: [eventSchema.target],
          cond: eventSchema.cond,
        }, stateSchema.events[eventName]);
      });
  }

  return state;
}

export function NewTransactionFromEvent(partialTransition: Partial<Transition>, eventSchema: EventSchema) {
  return {
    events: partialTransition.events,
    target: partialTransition.target,
    source: partialTransition.source,
    cond: eventSchema.cond || [],
  };
}
