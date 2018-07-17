import {
  StateSchema,
  ParallelStateSchema,
  CompoundStateSchema,
  AtomicStateSchema,
  RootSchema,
} from './types';

export function isParallelStateSchema(
  stateSchema: StateSchema | RootSchema
): stateSchema is ParallelStateSchema {
  return (<ParallelStateSchema>stateSchema).parallel === true;
}

export function isCompoundStateSchema(
  stateSchema: StateSchema
): stateSchema is CompoundStateSchema {
  return (<CompoundStateSchema>stateSchema).states !== undefined;
}

export function isAtomicStateSchema(
  stateSchema: StateSchema
): stateSchema is AtomicStateSchema {
  return !isCompoundStateSchema(stateSchema);
}
