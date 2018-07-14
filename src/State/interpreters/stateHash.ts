import {CHILD_DELIMITER} from './../../constants';
import {GetParentStateID} from '../state';
import {Queue} from '../../DataTypes/Queue';
import {
  CompoundStateSchema,
  GetStateSchemaFromPath,
  isCompoundStateSchema,
  StateMachineSchema,
} from '../../Schema/StateSchema';
import {NewStateFromSchema} from './state';
import {StateHash, StateID} from '../types';

export function NewStateHashFromSchema(
  stateMachineSchema: StateMachineSchema
): StateHash {
  const states = stateMachineSchema.states;
  const stateHash: StateHash = {};

  const queue = new Queue<StateID>(Object.keys(states));

  while (!queue.isEmpty()) {
    const current = queue.dequeue();
    const currentStateSchema = GetStateSchemaFromPath(states, current);

    stateHash[current] = NewStateFromSchema(currentStateSchema, {
      id: current,
      parentId: GetParentStateID(current),
    });

    if (isCompoundStateSchema(currentStateSchema)) {
      Object.keys((<CompoundStateSchema>currentStateSchema).states)
        .map((stateId) => `${current}${CHILD_DELIMITER}${stateId}`)
        .forEach(queue.enqueue.bind(queue));
    }
  }

  return stateHash;
}
