// @flow

type State = {
  [string]: any,
  events: {
    [string]: (...payload: any) => any
  }
};

type ParallelState = {
  [string]: State
};

type Statechart = State | ParallelState;

type StateMachine = {
  initial?: string,
  parallel?: boolean,
  states: {
    [string]: State | StateMachine
  }
};

type TTransition = (state: State | string, actionName: string, ...payload: Array<any>) => any;

interface MChine {
  transition: TTransition;
  changeStateTo(string): void;
  getCurrentState(): Statechart;
}

const _get = (target, path) =>
  path.split('.')
    .reduce((target, key) => target && target[key], target)

const getState = (stateMachine: StateMachine, path: string) =>
  _get(stateMachine.states, path.split('.').join('.states.'))

const mchine = (stateMachine: StateMachine): MChine => {
  let _statesHistory: Array<Statechart> = [];
  const states = stateMachine.states;

  const machine: MChine = {
    transition(state: State | string, actionName: string, ...payload: Array<any>): any {
      const currentState =  (typeof state === 'string' ? getState(stateMachine, state) : state) || {};
      const events = currentState.events || {};

      return Object.keys(events)
        .filter(key => key === actionName)
        .reduce(
          (_, actionName) => events[actionName](machine, ...payload),
          null
        );
    },
    changeStateTo(stateName: string) {
      _statesHistory = _statesHistory.concat(
        [stateName]
          .map(createState(stateMachine))
          .map(stateOrParallel(machine, stateMachine))
      );
    },
    get currentState(): Statechart {
      const currentState = _statesHistory[_statesHistory.length - 1];
      return currentState && Object.assign({}, currentState);
    },
    get history(): Array<State> {
      return _statesHistory.map(state => Object.assign({}, state));
    },
    getCurrentState(): Statechart {
      return machine.currentState;
    }
  };

  initialState(machine, stateMachine)

  return machine;
};

const createState = (stateMachine: StateMachine) => (
  stateName: string
): State =>
  Object.assign(
    {
      name: stateName,
      parent: stateName.split('.')[0],
    },
    getState(stateMachine, stateName)
  );

const initialState = (
  machine: MChine,
  stateMachine: StateMachine
): Statechart =>
  stateMachine.parallel
    ? InitialParallelState(machine, stateMachine)
    : InitialState(machine, stateMachine);

const InitialState = (machine: MChine, stateMachine: StateMachine, parentState: string): State =>
  machine.changeStateTo((parentState ? `${parentState}.`: '') + stateMachine.initial);

const InitialParallelState = (
  machine: MChine,
  stateMachine: StateMachine
): ParallelState =>
  Object.keys(stateMachine.states).reduce(
    (state: ParallelState, stateName: string): ParallelState =>
      Object.assign(state, {
        [stateName]: InitialState(machine, stateMachine.states[stateName], stateName)
      }),
    {}
  );

const stateOrParallel = (machine: MChine, stateMachine: StateMachine) => (
  state: State
): Statechart =>
  stateMachine.parallel
    ? Object.assign({}, machine.getCurrentState(), { [state.parent]: state })
    : state;

export default mchine;
