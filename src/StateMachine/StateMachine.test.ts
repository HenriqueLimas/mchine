import {StateMachineSchema} from './../Schema/StateSchema/types';
import {StateID} from '../State/types';
import {StateMachine} from './StateMachine';

describe('getCurrentState()', () => {
  type fields = {
    stateMachine: StateMachineSchema;
  };

  const tests: {
    name: string;
    fields: fields;
    want: string | Record<string, any>;
  }[] = [
    {
      name: 'should return simple states',
      fields: {
        stateMachine: {initial: 'idle', states: {idle: {}}},
      },
      want: 'idle',
    },
    {
      name: 'should return substates',
      fields: {
        stateMachine: {
          initial: 'idle',
          states: {
            idle: {
              initial: 'children',
              states: {
                children: {},
              },
            },
          },
        },
      },
      want: {idle: 'children'},
    },
    {
      name: 'should return substates of substates',
      fields: {
        stateMachine: {
          initial: 'idle',
          states: {
            idle: {
              initial: 'children',
              states: {
                children: {
                  initial: 'grandchildren',
                  states: {
                    grandchildren: {},
                  },
                },
              },
            },
          },
        },
      },
      want: {idle: {children: 'grandchildren'}},
    },

    {
      name: 'should return maintain parallel states',
      fields: {
        stateMachine: {
          initial: 'idle',
          states: {
            idle: {
              parallel: true,
              states: {
                children: {
                  initial: 'grandchildren',
                  states: {
                    grandchildren: {},
                  },
                },
                brother: {
                  initial: 'grandBrotherChildren',
                  states: {
                    grandBrotherChildren: {},
                  },
                },
              },
            },
          },
        },
      },
      want: {
        idle: {children: 'grandchildren', brother: 'grandBrotherChildren'},
      },
    },
  ];

  tests.forEach((tt) => {
    it(tt.name, () => {
      const stateMachine = new StateMachine(tt.fields.stateMachine);
      expect(stateMachine.getCurrentState()).toEqual(tt.want);
    });
  });
});
