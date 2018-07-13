import {Event} from './../../Transition';
import {ExternalData} from '../TransitionSchema';

export type ActionSchemaString = string;
export type ActionSchemaObject = {
  type: string;
  [key: string]: any;
};

export type ActionSchemaFunction = ((data: ExternalData, event: Event) => void);

export type ActionSchema =
  // | ActionSchemaString
  // | ActionSchemaObject
  | ActionSchemaFunction;
