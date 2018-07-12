import { StateSchema, ParallelStateSchema, CompoundStateSchema, AtomicStateSchema } from "./types";

export function isParallelStateSchema(stateSchema: StateSchema): stateSchema is ParallelStateSchema {
  return (<ParallelStateSchema>stateSchema).parallel === true;
}

export function isCompoundStateSchema(stateSchema: StateSchema): stateSchema is CompoundStateSchema {
  return (<CompoundStateSchema>stateSchema).states !== undefined;
}

export function isAtomicStateSchema(stateSchema: StateSchema): stateSchema is AtomicStateSchema {
  return !isCompoundStateSchema(stateSchema);
}