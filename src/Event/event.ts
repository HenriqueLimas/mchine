import {Event} from './types';
import {CHILD_DELIMITER} from '../constants';
import {State} from '../State/types';

export function newEvent(eventName, ...data: any[]): Event {
  return {
    name: eventName,
    data: data,
  };
}

export function eventMatch(
  eventToCheck: Event,
  eventToExecute: Event,
  state: State
): boolean {
  const eventPath = eventToExecute.name.split(CHILD_DELIMITER);
  const eventName = eventPath[eventPath.length - 1];
  const path = eventPath.slice(0, eventPath.length - 1).join(CHILD_DELIMITER);

  return (
    eventToCheck.name === eventName &&
    (state.parentId === path || eventPath.length === 1)
  );
}
