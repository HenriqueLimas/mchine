import {getParentStateID, concatStateIDs} from '../state';
import {Queue} from '../../DataTypes/Queue';
import {
  CompoundStateSchema,
  GetStateSchemaFromPath,
  isCompoundStateSchema,
  StateMachineSchema,
} from '../../Schema/StateSchema';
import {newStateFromSchema} from './state';
import {StateHash, StateID} from '../types';

export function newStateHashFromSchema(
  stateMachineSchema: StateMachineSchema
): StateHash {
  const states = stateMachineSchema.states;
  const stateHash: StateHash = {};

  const queue = new Queue<StateID>(Object.keys(states));

  while (!queue.isEmpty()) {
    const current = queue.dequeue();
    const currentStateSchema = GetStateSchemaFromPath(states, current);

    stateHash[current] = newStateFromSchema(currentStateSchema, {
      id: current,
      parentId: getParentStateID(current),
    });

    if (isCompoundStateSchema(currentStateSchema)) {
      Object.keys((<CompoundStateSchema>currentStateSchema).states)
        .map((stateId) => concatStateIDs(current, stateId))
        .forEach(queue.enqueue.bind(queue));
    }
  }

  return stateHash;
}
