import {Action, ActionFunction} from './types';
import {isActionFunction} from './typeGards';
import {Event} from '../Event/types';

export function executeAction(action: Action, event: Event): any {
  if (isActionFunction(action)) {
    return (<ActionFunction>action)(event);
  }
}
