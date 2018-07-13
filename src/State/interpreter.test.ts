import {StateHash} from './types';
import {StateMachineSchema} from './../Schema/StateSchema';
import {schemaToState} from './interpreter';

describe('schemaToState()', () => {
  type args = {
    stateMachineSchema: StateMachineSchema;
  };

  const tests: {
    name: string;
    args: args;
    want: StateHash;
  }[] = [
    {
      name: 'should return a hash of one atomic state',
      args: {
        stateMachineSchema: {
          states: {
            idle: {
              events: {
                fetch: {
                  target: 'loading',
                },
              },
            },
          },
        },
      },
      want: {
        idle: {
          id: 'idle',
          parentId: null,
          transitions: [
            {target: ['loading'], source: 'idle', events: ['fetch'], cond: []},
          ],
          onEntry: [],
          onExit: [],
        },
      },
    },
  ];

  tests.forEach((tt) => {
    it(tt.name, () => {
      expect(schemaToState(tt.args.stateMachineSchema)).toEqual(tt.want);
    });
  });
});
