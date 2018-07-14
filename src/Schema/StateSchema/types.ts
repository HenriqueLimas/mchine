import {ActionSchema} from './../ActionSchema';
import {EventSchema} from '../TransitionSchema';

export type AtomicStateSchema = {
  onEntry?: ActionSchema[];
  onExit?: ActionSchema[];
  events?: Record<string, EventSchema>;
};

export type StateNodeSchema = AtomicStateSchema & {
  initial: string;
  states: StateMapSchema;
};

export type ParallelStateSchema = AtomicStateSchema & {
  parallel: boolean;
  states: StateMapSchema;
};

export type CompoundStateSchema = StateNodeSchema | ParallelStateSchema;
export type StateSchema = AtomicStateSchema | CompoundStateSchema;
export type StateMapSchema = {
  [state: string]: StateSchema;
};

export type RootSchema = {
  initial?: string;
  parallel?: boolean;
  states: StateMapSchema;
};

export type StateMachineSchema = RootSchema;
