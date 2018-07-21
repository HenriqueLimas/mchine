import {ExternalData} from '../Schema/TransitionSchema/types';

// Event is what triggers the transition (currently a simple string)
export type Event = {
  name: string;
  data?: ExternalData;
};
