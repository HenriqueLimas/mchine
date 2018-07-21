import {Action} from './../../Action/types';
export type Cond = ((data: ExternalData, event: Event) => boolean);

export type ExternalData = any;

export type EventSchema = {
  target: string;
  cond?: Cond[];
  actions?: Action[];
};
