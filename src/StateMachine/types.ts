import {List} from './../DataTypes/List';
import {HashTable} from './../DataTypes/HashTable';
import {StateSet, StateID} from './../State/types';
import {Transition, TransitionSet} from './../Transition/types';
import {Event} from '../Event/types';
import {State} from '../State/types';

interface StateMachine {
  selectTransitions(event: Event): TransitionSet;
  removeConflictingTransitions(enabledTransitions: TransitionSet);
  microstep(enabledTransitions: TransitionSet);
  exitStates(enabledTransitions: TransitionSet);
  computeExitSet(enabledTransitions: TransitionSet): StateSet;
  executeTransitionContent(enabledTransitions: TransitionSet);
  enterStates(enabledTransitions: TransitionSet);
  computeEntrySet(
    transitions: TransitionSet,
    statesToEnter: StateSet,
    statesForDefaultEntry: StateSet,
    defaultHistoryContent?: HashTable<any>
  );
  addDescendantStatesToEnter(
    stateID: StateID,
    statesToEnter: StateSet,
    statesForDefaultEntry: StateSet,
    defaultHistoryContent?: HashTable<any>
  );
  addAncestorStatesToEnter(
    stateID: StateID,
    ancestor: StateID,
    statesToEnter: StateSet,
    statesForDefaultEntry: StateSet,
    defaultHistoryContent?: HashTable<any>
  );
  isInFinalState(state: State): boolean;
  getTransitionDomain(transition: Transition): List<StateID>;
  findLCCA(stateList: List<StateID>): List<StateID>;
  getEffectiveTargetStates(transition: Transition): List<StateID>;
  getProperAncestors(state1: State, state2?: State): State;
  isDescendant(state1: State, state2: State): boolean;
  getChildStates(state: State): List<State>;
}
