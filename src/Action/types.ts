import {Event} from '../Event/types';

export type ActionString = string;
export type ActionFunction = ((event: Event) => void);
export type Action = ActionFunction | ActionString;
