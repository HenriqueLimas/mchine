import {OrderedSet} from './../DataTypes/OrderedSet';
import {StateID, StateHash} from './../State/types';
import {Transition} from './types';
import {List} from '../DataTypes/List';
import {isCompoundState} from '../State';
import {findLCCA, isDescendant} from '../State/state';

export function newTransition(transition: Partial<Transition>): Transition {
  return {
    target: transition.target || [],
    events: transition.events || [],
    source: transition.source,
    cond: transition.cond || [],
  };
}

export function getTransitionDomain(
  stateHash: StateHash,
  transition: Transition
): StateID {
  const tstates = getEffectiveTargetStates(stateHash, transition);

  if (tstates.isEmpty()) {
    return null;
  } else if (
    transition.source &&
    isCompoundState(stateHash[transition.source]) &&
    tstates.every((stateId) => isDescendant(stateId, transition.source))
  ) {
    return transition.source;
  } else {
    return findLCCA(
      stateHash,
      new List<StateID>([transition.source].filter(Boolean)).concat(
        tstates.toList()
      )
    );
  }
}

export function getEffectiveTargetStates(
  stateHash: StateHash,
  transition: Transition
): OrderedSet<StateID> {
  // TODO: Derefence History states (need to use stateHash)
  return new OrderedSet<StateID>(transition.target);
}
