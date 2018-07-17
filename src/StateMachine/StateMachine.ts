import {CHILD_DELIMITER} from './../constants';
import {isParallelStateSchema} from '../Schema/StateSchema';
import {List} from '../DataTypes/List';
import {NewStateHashFromSchema} from '../State/interpreters/stateHash';
import {NewTransition} from '../Transition/transition';
import {OrderedSet} from './../DataTypes/OrderedSet';
import {Queue} from './../DataTypes/Queue';
import {StateHash, StateID} from './../State/types';
import {StateMachineSchema} from './../Schema/StateSchema/types';
import {Transition} from './../Transition/types';
import {isAtomicState} from '../State/typeGards';

export class StateMachine {
  private configuration: OrderedSet<StateID>;
  private statesToInvoke: OrderedSet<StateID>;
  private internalQueue: Queue<StateID>;
  private stateHash: StateHash;

  constructor(stateMachineSchema: StateMachineSchema) {
    this.configuration = new OrderedSet<StateID>();
    this.statesToInvoke = new OrderedSet<StateID>();
    this.internalQueue = new Queue<StateID>();
    this.stateHash = NewStateHashFromSchema(stateMachineSchema);

    this.enterInitialStates(stateMachineSchema);
  }

  private enterInitialStates(stateMachineSchema: StateMachineSchema) {
    const initialTransition = new List<Transition>();

    if (isParallelStateSchema(stateMachineSchema)) {
      Object.keys(stateMachineSchema.states).forEach((stateID) =>
        initialTransition.append(NewTransition({target: [stateID]}))
      );
    } else {
      initialTransition.append(
        NewTransition({target: [stateMachineSchema.initial]})
      );
    }

    this.enterStates(initialTransition);
  }

  private enterStates(enabledTransitions: List<Transition>) {
    const statesToEnter = new OrderedSet<StateID>();
    const statesForDefaultEntry = new OrderedSet<StateID>();

    // TODO: Initialize history here
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
    });
  }

  private addDescendantStatesToEnter(
    stateID: StateID,
    statesToEnter: OrderedSet<StateID>,
    statesForDefaultEntry: OrderedSet<StateID>
  ) {}

  // Used only for testing
  __setConfiguration__(stateIDs: StateID[]) {
    this.configuration = new OrderedSet(stateIDs);
  }

  getCurrentState() {
    const currentStateList = this.configuration
      .toList()
      .filter((stateID) => isAtomicState(this.stateHash[stateID]));

    if (
      currentStateList.size() <= 1 &&
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
