import {Event} from '../../Event/types';

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
