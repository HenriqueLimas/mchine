import {StateID, StateHash} from './../State/types';
import {Transition} from './types';
import {List} from '../DataTypes/List';
import {isCompoundState} from '../State';

export function NewTransition(transition: Partial<Transition>): Transition {
  return {
    target: transition.target || [],
    events: transition.events || [],
    source: transition.source,
    cond: transition.cond || [],
  };
}

export function CreateTransitionGettersForHash(stateHash: StateHash) {
  function getTransitionDomain(transition: Transition): StateID {
    const tstates = getEffectiveTargetStates(transition);

    if (tstates.isEmpty()) {
      return null;
    } else if (
      transition.source &&
      isCompoundState(
        stateHash[transition.source]
      ) /* TODO: && all tstates are desendents of transition.source */
    ) {
      return transition.source;
    } else {
      return findLCCA(new List<StateID>([transition.source]).concat(tstates));
    }
  }

  function getEffectiveTargetStates(transition: Transition): List<StateID> {
    return new List<StateID>();
  }

  function findLCCA(stateList: List<StateID>): StateID {
    // TODO: find lcca correctly
    return stateList.head();
  }

  return {
    getTransitionDomain,
    getEffectiveTargetStates,
  };
}
