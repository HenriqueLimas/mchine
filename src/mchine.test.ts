import {CurrentState} from './State/types';
import {StateMachineSchema} from './Schema/StateSchema/types';
import {mchine} from './mchine';

const simpleMachine = {
  initial: 'idle',
  states: {
    idle: {
      events: {
        login: {
          target: 'loading',
        },
      },
    },
    loading: {},
  },
};

describe('mchine.initialState', () => {
  type args = {
    stateMachineSchema: StateMachineSchema;
  };

  const tests: {
    name: string;
    args: args;
    want: CurrentState;
  }[] = [
    {
      name: 'should return the right state',
      args: {
        stateMachineSchema: simpleMachine,
      },
      want: 'idle',
    },
  ];

  tests.forEach((tt) => {
    it(tt.name, () => {
      expect(mchine(tt.args.stateMachineSchema).getCurrentState()).toEqual(
        tt.want
      );
    });
  });
});

describe('mchine.transition()', () => {
  type args = {
    stateMachineSchema: StateMachineSchema;
    eventName: string;
    data: any[];
  };

  const tests: {
    name: string;
    args: args;
    want: CurrentState;
  }[] = [
    {
      name: 'should change the current state',
      args: {
        stateMachineSchema: simpleMachine,
        eventName: 'login',
        data: ['email@example.com', '12345'],
      },
      want: 'loading',
    },
    {
      name:
        'should not change the current state when the event do not exist in the current state',
      args: {
        stateMachineSchema: simpleMachine,
        eventName: 'eventThatDoNotExists',
        data: ['email@example.com', '12345'],
      },
      want: 'idle',
    },

    {
      name: 'should change the current parallel state',
      args: {
        stateMachineSchema: {
          parallel: true,
          states: {
            bold: {
              initial: 'on',
              states: {
                on: {
                  events: {
                    toggle: {
                      target: 'bold.off',
                    },
                  },
                },
                off: {
                  events: {
                    toggle: {
                      target: 'bold.on',
                    },
                  },
                },
              },
            },
            italic: {
              initial: 'off',
              states: {
                on: {
                  events: {
                    toggle: {
                      target: 'italic.off',
                    },
                  },
                },
                off: {
                  events: {
                    toggle: {
                      target: 'italic.on',
                    },
                  },
                },
              },
            },
          },
        },
        eventName: 'bold.toggle',
        data: [],
      },
      want: {
        bold: 'off',
        italic: 'off',
      },
    },
  ];

  tests.forEach((tt) => {
    it(tt.name, () => {
      const stateMachine = mchine(tt.args.stateMachineSchema);

      expect(
        stateMachine.transition(tt.args.eventName, ...tt.args.data)
      ).toEqual(tt.want);
    });
  });
});
