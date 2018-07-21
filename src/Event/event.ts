import {Event} from './types';

export function newEvent(eventName, ...data: any[]): Event {
  return {
    name: eventName,
    data: data,
  };
}
