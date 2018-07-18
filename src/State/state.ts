import {OrderedSet} from './../DataTypes/OrderedSet';
import {CHILD_DELIMITER} from './../constants';
import {StateID, StateHash, State} from './types';
import {List} from '../DataTypes/List';
import {isCompoundState} from './typeGards';

export function GetParentStateID(stateId: StateID): StateID {
  const arrayPath = stateId.split(CHILD_DELIMITER);
  return ConcatStateIDs(...arrayPath.splice(0, arrayPath.length - 1)) || null;
}

export function ConcatStateIDs(...stateIDs: StateID[]): StateID {
  return stateIDs.join(CHILD_DELIMITER);
}

export function FindLCCA(
  stateHash: StateHash,
  stateList: List<StateID>
): StateID {
  const compoundAncestors: List<StateID> = GetProperAncestors(stateList.head())
    .toList()
    .map<State>((stateID) => stateHash[stateID])
    .filter(isCompoundState)
    .map<StateID>((state: State): StateID => state.id);

  for (const anc of compoundAncestors.list) {
    if (
      stateList.tail().every((stateID: StateID) => IsDescendant(stateID, anc))
    ) {
      return anc;
    }
  }

  return stateList.head();
}

export function GetProperAncestors(
  state1: StateID,
  state2?: StateID
): OrderedSet<StateID> {
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

  return new OrderedSet<StateID>(ancestors);
}

export function IsDescendant(state1: StateID, state2: StateID): boolean {
  return state1.slice(0, state2.length + 1).replace(/\.$/, '') === state2;
}

function getAncestorFromStateID(
  stateID: StateID,
  ancestorIndex?: number
): StateID {
  const stateAncestors = stateID.split(CHILD_DELIMITER);
  return stateAncestors.slice(0, ancestorIndex).join(CHILD_DELIMITER);
}
