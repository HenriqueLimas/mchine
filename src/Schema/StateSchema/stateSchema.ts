import {CHILD_DELIMITER} from './../../constants';
import {StateMapSchema} from './types';
import {StateSchema} from './';

export function GetStateSchemaFromPath(
  states: StateMapSchema,
  path: string
): StateSchema {
  return path
    .split(CHILD_DELIMITER)
    .join(CHILD_DELIMITER + 'states' + CHILD_DELIMITER)
    .split(CHILD_DELIMITER)
    .reduce((state: StateSchema, path: string) => state && state[path], states);
}
