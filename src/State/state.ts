import {CHILD_DELIMITER} from './../constants';
import {StateID} from './types';

export function GetParentStateID(stateId: StateID): StateID {
  const arrayPath = stateId.split(CHILD_DELIMITER);
  return (
    ConcatStateIDs(...arrayPath.splice(0, arrayPath.length - 1)) || null
  );
}

export function ConcatStateIDs(...stateIDs: StateID[]): StateID {
  return stateIDs.join(CHILD_DELIMITER);
}
