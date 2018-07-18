import {StateMachineSchema} from './../Schema/StateSchema/types';
import {StateID} from '../State/types';
import {StateMachine} from './StateMachine';

describe('getCurrentState()', () => {
  type fields = {
    configuration: StateID[];
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
        configuration: ['idle'],
        stateMachine: {initial: 'idle', states: {idle: {}}},
      },
      want: 'idle',
    },
    {
      name: 'should return substates',
      fields: {
        configuration: ['idle', 'idle.children'],
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
        configuration: ['idle', 'idle.children', 'idle.children.grandchildren'],
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
        configuration: [
          'idle',
          'idle.children',
          'idle.children.grandchildren',
          'idle.brother.grandBrotherChildren',
        ],
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

      stateMachine.__setConfiguration__(tt.fields.configuration);

      expect(stateMachine.getCurrentState()).toEqual(tt.want);
    });
  });
});
