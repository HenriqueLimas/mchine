import {Action} from './../Action/types';
import {findLCCA, isDescendant, getProperAncestors} from '../State/state';
import {isCompoundState, isAtomicState} from '../State';
import {List} from '../DataTypes/List';
import {OrderedSet} from './../DataTypes/OrderedSet';
import {StateID, StateHash, State} from './../State/types';
import {Transition} from './types';
import {Event} from '../Event/types';
import {eventMatch} from '../Event/event';
import {executeAction} from '../Action/action';

export function newTransition(transition: Partial<Transition>): Transition {
  return {
    target: transition.target || [],
    events: transition.events || [],
    source: transition.source,
    cond: transition.cond || [],
    actions: transition.actions || [],
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

export function selectTransitions(
  states: OrderedSet<StateID>,
  stateHash: StateHash,
  event?: Event
): OrderedSet<Transition> {
  let enabledTransitions = new OrderedSet<Transition>();
  const atomicStates = states
    .toList()
    .map((stateID: StateID) => stateHash[stateID])
    .filter(isAtomicState)
    .map((state: State) => state.id);

  for (let i = 0; i < atomicStates.size(); i++) {
    const state = atomicStates.list[i];

    const statesToEnter = new List<StateID>([state]).concat(
      getProperAncestors(state)
    );

    loop: for (let j = 0; j < statesToEnter.size(); j++) {
      const state = stateHash[statesToEnter.list[j]];

      for (const transition of state.transitions) {
        if (conditionMatch(transition)) {
          if (
            (!event && !transition.events.length) ||
            transition.events.filter((transitionEvent: Event) =>
              eventMatch(transitionEvent, event, state)
            ).length > 0
          ) {
            enabledTransitions.add(transition);
            break loop;
          }
        }
      }
    }
  }

  return removeConflictingTransitions(enabledTransitions);
}

function conditionMatch(transition: Transition): boolean {
  return !transition.cond.length;
}

function removeConflictingTransitions(
  transitions: OrderedSet<Transition>
): OrderedSet<Transition> {
  return transitions;
}

export function executeTransitionActions(transition: Transition, event: Event) {
  transition.actions.forEach((action: Action) => executeAction(action, event));
}
