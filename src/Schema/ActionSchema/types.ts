import {Event} from '../../Event/types';
import {ExternalData} from '../TransitionSchema';

export type ActionSchemaString = string;
export type ActionSchemaObject = {
  type: string;
  [key: string]: any;
};

export type ActionSchemaFunction = ((event: Event) => void);

export type ActionSchema =
  // | ActionSchemaString
  // | ActionSchemaObject
  ActionSchemaFunction;
