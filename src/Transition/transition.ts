import {OrderedSet} from './../DataTypes/OrderedSet';
import {StateID, StateHash} from './../State/types';
import {Transition} from './types';
import {List} from '../DataTypes/List';
import {isCompoundState} from '../State';
import {FindLCCA, IsDescendant} from '../State/state';

export function NewTransition(transition: Partial<Transition>): Transition {
  return {
    target: transition.target || [],
    events: transition.events || [],
    source: transition.source,
    cond: transition.cond || [],
  };
}

export function GetTransitionDomain(
  stateHash: StateHash,
  transition: Transition
): StateID {
  const tstates = GetEffectiveTargetStates(stateHash, transition);

  if (tstates.isEmpty()) {
    return null;
  } else if (
    transition.source &&
    isCompoundState(stateHash[transition.source]) &&
    tstates.every((stateId) => IsDescendant(stateId, transition.source))
  ) {
    return transition.source;
  } else {
    return FindLCCA(
      stateHash,
      new List<StateID>([transition.source].filter(Boolean)).concat(
        tstates.toList()
      )
    );
  }
}

export function GetEffectiveTargetStates(
  stateHash: StateHash,
  transition: Transition
): OrderedSet<StateID> {
  // TODO: Derefence History states (need to use stateHash)
  return new OrderedSet<StateID>(transition.target);
}
