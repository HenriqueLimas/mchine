import {ActionFunction, Action, ActionString} from './types';

export function isActionFunction(action: Action): action is ActionFunction {
  return typeof action === 'function';
}

export function isActionString(action: Action): action is ActionString {
  return typeof action === 'string';
}
