import {CHILD_DELIMITER} from './../constants';
import {StateID} from './types';

export function GetParentStateID(stateId: StateID): StateID {
  const arrayPath = stateId.split(CHILD_DELIMITER);
  return (
    arrayPath.splice(0, arrayPath.length - 1).join(CHILD_DELIMITER) || null
  );
}
