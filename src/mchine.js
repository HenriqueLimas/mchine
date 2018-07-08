// @flow

type State = {
  [string]: any,
  actions: {
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
    [string]: State
  }
};

type TDispatch = (actionName: string, ...payload: Array<any>) => any;

interface MChine {
  dispatch: TDispatch;
  changeStateTo(string): void;
  getCurrentState(): Statechart;
}

const _get = (target, path) =>
  path.split('.')
    .reduce((target, key) => target && target[key], target)

const mchine = (stateMachine: StateMachine): MChine => {
  let _statesHistory: Array<Statechart> = [];
  const states = stateMachine.states;

  const machine = {
    dispatch(actionName: string, ...payload: Array<any>): any {
      const currentState = machine.currentState || {};
      const actions = currentState.actions || {};

      return Object.keys(actions)
        .filter(key => key === actionName)
        .reduce(
          (_, actionName) => actions[actionName](machine, ...payload),
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
      __mchine_name__: stateName.split('.')[0]
    },
    _get(stateMachine.states, stateName)
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
    ? Object.assign({}, machine.getCurrentState(), { [state.__mchine_name__]: state })
    : state;

export default mchine;
