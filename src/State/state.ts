import {CHILD_DELIMITER} from './../constants';
import {Event} from '../Event/types';
import {isCompoundState} from './typeGards';
import {List} from '../DataTypes/List';
import {StateID, StateHash, State, AtomicState} from './types';

export function getParentStateID(stateId: StateID): StateID {
  const arrayPath = stateId.split(CHILD_DELIMITER);
  return concatStateIDs(...arrayPath.splice(0, arrayPath.length - 1)) || null;
}

export function concatStateIDs(...stateIDs: StateID[]): StateID {
  return stateIDs.join(CHILD_DELIMITER);
}

export function findLCCA(
  stateHash: StateHash,
  stateList: List<StateID>
): StateID {
  const compoundAncestors: List<StateID> = getProperAncestors(stateList.head())
    .map<State>((stateID) => stateHash[stateID])
    .filter(isCompoundState)
    .map<StateID>((state: State): StateID => state.id);

  for (const anc of compoundAncestors.list) {
    if (
      stateList.tail().every((stateID: StateID) => isDescendant(stateID, anc))
    ) {
      return anc;
    }
  }

  return stateList.head();
}

export function getProperAncestors(
  state1: StateID,
  state2?: StateID
): List<StateID> {
  const state1Ancestors = state1.split(CHILD_DELIMITER);
  const ancestors: StateID[] = [];
  let currentAncestorIndex = state1Ancestors.length - 1;
  let currentAncestor: StateID = getAncestorFromStateID(
    state1,
    currentAncestorIndex
  );

  while (currentAncestorIndex > 0 && currentAncestor !== state2) {
    currentAncestor = getAncestorFromStateID(state1, currentAncestorIndex--);

    if (currentAncestor === state2) {
      break;
    }

    ancestors.push(currentAncestor);
  }

  return new List<StateID>(ancestors);
}

export function isDescendant(state1: StateID, state2: StateID): boolean {
  return state1.slice(0, state2.length + 1).replace(/\.$/, '') === state2;
}

export function executeStateOnExit(state: AtomicState, event: Event) {
  state.onExit.forEach((handleExit) => handleExit(event));
}

export function executeStateOnEntry(state: AtomicState, event: Event) {
  state.onEntry.forEach((handleEntry) => handleEntry(event));
}

function getAncestorFromStateID(
  stateID: StateID,
  ancestorIndex?: number
): StateID {
  const stateAncestors = stateID.split(CHILD_DELIMITER);
  return stateAncestors.slice(0, ancestorIndex).join(CHILD_DELIMITER);
}
