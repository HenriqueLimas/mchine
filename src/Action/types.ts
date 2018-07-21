import {Event} from '../Event/types';
import {ExternalData} from './../Schema/TransitionSchema/types';

export type Action = ((event: Event) => void);
