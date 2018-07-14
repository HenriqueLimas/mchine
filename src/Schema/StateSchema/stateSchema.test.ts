import {StateMapSchema, StateSchema} from './types';
import {GetStateSchemaFromPath} from './stateSchema';

describe('GetStateSchemaFromPath()', () => {
  type args = {
    states: Partial<StateMapSchema>;
    path: string;
  };

  const tests: {
    name: string;
    args: args;
    want: StateSchema;
  }[] = [
    {
      name: 'should return the schema',
      args: {
        states: {
          idle: {
            initial: 'idle',
            states: {},
          },
        },
        path: 'idle',
      },
      want: {
        initial: 'idle',
        states: {},
      },
    },
    {
      name: 'should return the child schema',
      args: {
        states: {
          idle: {
            initial: 'loading',
            states: {
              loading: {
                parallel: true,
                states: {},
              },
            },
          },
        },
        path: 'idle.loading',
      },
      want: {
        parallel: true,
        states: {},
      },
    },
    {
      name: 'should return the grandchild schema',
      args: {
        states: {
          idle: {
            initial: 'loading',
            states: {
              loading: {
                parallel: true,
                states: {
                  subloading: {
                    events: {},
                  },
                },
              },
            },
          },
        },
        path: 'idle.loading.subloading',
      },
      want: {
        events: {},
      },
    },
    {
      name: 'should return undefined when it doesn\'t exist',
      args: {
        states: {},
        path: 'idle.loading.subloading',
      },
      want: undefined,
    },
  ];

  tests.forEach((tt) => {
    it(tt.name, () => {
      expect(GetStateSchemaFromPath(tt.args.states, tt.args.path)).toEqual(
        tt.want
      );
    });
  });
});
