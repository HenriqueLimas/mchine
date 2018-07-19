import {CHILD_DELIMITER} from './../constants';
import {List} from '../DataTypes/List';
import {newStateHashFromSchema} from '../State/interpreters/stateHash';
import {
  newTransition,
  getTransitionDomain,
  getEffectiveTargetStates,
} from '../Transition/transition';
import {OrderedSet} from './../DataTypes/OrderedSet';
import {StateHash, StateID} from './../State/types';
import {StateMachineSchema} from './../Schema/StateSchema/types';
import {Transition} from './../Transition/types';
import {
  isAtomicState,
  isCompoundState,
  isParallelState,
} from '../State/typeGards';
import {isDescendant, getProperAncestors} from '../State/state';

export class StateMachine {
  private configuration: OrderedSet<StateID>;
  private statesToInvoke: OrderedSet<StateID>;
  private stateHash: StateHash;

  constructor(stateMachineSchema: StateMachineSchema) {
    this.configuration = new OrderedSet<StateID>();
    this.statesToInvoke = new OrderedSet<StateID>();
    this.stateHash = newStateHashFromSchema(stateMachineSchema);

    this.enterStates(
      new List<Transition>([
        newTransition({target: [stateMachineSchema.initial]}),
      ])
    );
  }

  enterStates(enabledTransitions: List<Transition>) {
    const statesToEnter = new OrderedSet<StateID>();
    const statesForDefaultEntry = new OrderedSet<StateID>();

    // TODO: Initialize history here

    this.computeEntrySet(
      enabledTransitions,
      statesToEnter,
      statesForDefaultEntry
    );

    statesToEnter.toList().forEach((stateID: StateID) => {
      this.configuration.add(stateID);
      this.statesToInvoke.add(stateID);
    });
  }

  private computeEntrySet(
    transitions: List<Transition>,
    statesToEnter: OrderedSet<StateID>,
    statesForDefaultEntry: OrderedSet<StateID>
  ) {
    transitions.forEach((transition: Transition) => {
      transition.target.forEach((stateID) => {
        this.addDescendantStatesToEnter(
          stateID,
          statesToEnter,
          statesForDefaultEntry
        );
      });

      const ancestor = getTransitionDomain(this.stateHash, transition);

      getEffectiveTargetStates(this.stateHash, transition)
        .toList()
        .forEach((stateID: StateID) => {
          this.addAncestorStateToEnter(
            stateID,
            ancestor,
            statesToEnter,
            statesForDefaultEntry
          );
        });
    });
  }

  private addDescendantStatesToEnter(
    stateID: StateID,
    statesToEnter: OrderedSet<StateID>,
    statesForDefaultEntry: OrderedSet<StateID>
  ) {
    statesToEnter.add(stateID);

    const state = this.stateHash[stateID];
    if (isCompoundState(state) && !isParallelState(state)) {
      statesForDefaultEntry.add(stateID);
      this.addDescendantStatesToEnter(
        state.initial,
        statesToEnter,
        statesForDefaultEntry
      );

      this.addAncestorStateToEnter(
        state.initial,
        stateID,
        statesToEnter,
        statesForDefaultEntry
      );
    } else if (isParallelState(state)) {
      Object.keys(state.states)
        .filter(
          (childID: StateID) =>
            !statesToEnter.some((stateToEnterID: StateID) =>
              isDescendant(stateToEnterID, childID)
            )
        )
        .forEach((childID: StateID) => {
          this.addDescendantStatesToEnter(
            childID,
            statesToEnter,
            statesForDefaultEntry
          );
        });
    }
  }

  private addAncestorStateToEnter(
    stateID: StateID,
    ancestor: StateID,
    statesToEnter: OrderedSet<StateID>,
    statesForDefaultEntry: OrderedSet<StateID>
  ) {
    const ancestors = getProperAncestors(stateID, ancestor);

    ancestors.toList().forEach((anc) => {
      statesToEnter.add(anc);

      const ancestorState = this.stateHash[anc];

      if (isParallelState(ancestorState)) {
        Object.keys(ancestorState.states)
          .filter(
            (childID: StateID) =>
              !statesToEnter.some((stateToEnterID: StateID) =>
                isDescendant(stateToEnterID, childID)
              )
          )
          .forEach((childID: StateID) =>
            this.addDescendantStatesToEnter(
              childID,
              statesToEnter,
              statesForDefaultEntry
            )
          );
      }
    });
  }

  getCurrentState() {
    const currentStateList = this.configuration
      .toList()
      .filter((stateID) => isAtomicState(this.stateHash[stateID]));

    if (
      currentStateList.size() === 1 &&
      currentStateList.head().split(CHILD_DELIMITER).length === 1
    ) {
      return currentStateList.head().split(CHILD_DELIMITER)[0];
    }

    const currentState = {};

    currentStateList.forEach((statePath) => {
      const arrayPath = statePath.split(CHILD_DELIMITER);
      const lastStateAncestor = arrayPath
        .slice(0, arrayPath.length - 2)
        .reduce((state, stateID) => {
          state[stateID] = state[stateID] || {};

          return state[stateID];
        }, currentState);

      const beforeLastState = arrayPath[arrayPath.length - 2];
      const lastState = arrayPath[arrayPath.length - 1];

      lastStateAncestor[beforeLastState] = lastState;
    });

    return currentState;
  }
}
