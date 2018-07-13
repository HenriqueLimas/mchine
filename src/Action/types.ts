import {Event} from './../Transition/types';
import {ExternalData} from './../Schema/TransitionSchema/types';

export type Action = ((data: ExternalData, event: Event) => void);
