import {Event} from './../Transition/types';
import {ExternalData} from './../Schema/TransitionSchema/types';

export type Action = ((event: Event) => void);
