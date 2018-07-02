// @flow

interface State {
    [string]: any;
    actions: {
        [string]: (...payload: any) => any
    };
}

interface StateMachine {
    [string]: State
}

type TDispatch = (actionName: string, ...payload: Array<any>) => any;

interface MChine {
    dispatch: TDispatch;
    changeStateTo(string): void;
    getCurrentState(): StateMachine;
}

const mchine = (stateMachine: StateMachine, initialState: ?string): MChine => {
    let _statesHistory: Array<State> = [];

    const machine = {
        dispatch(actionName: string, ...payload: Array<any>): any {
            const currentState = machine.currentState;
            const actions = currentState.actions || {};

            return Object.keys(actions)
                .filter(key => key === actionName)
                .reduce((_, actionName) => actions[actionName](machine, ...payload), null);
        },
        changeStateTo(stateName: string) {
            _statesHistory = _statesHistory.concat([
                Object.assign({ __mchine_name__: stateName }, stateMachine[stateName])
            ]);
        },
        get currentState(): State {
            return Object.assign({}, _statesHistory[_statesHistory.length - 1]);
        },
        get history(): Array<State> {
            return _statesHistory.map(state => Object.assign({}, state));
        },
    };

    if (initialState) {
        machine.changeStateTo(initialState)
    }

    return machine;
};

export default mchine;
