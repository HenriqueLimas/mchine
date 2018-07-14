import {StateHash} from '../types';
import {StateMachineSchema} from '../../Schema/StateSchema';
import {NewStateHashFromSchema} from './stateHash';

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
            {
              target: ['loading'],
              source: 'idle',
              events: ['fetch'],
              cond: [],
            },
          ],
          onEntry: [],
          onExit: [],
        },
      },
    },

    {
      name: 'should return a hash of the compound states',
      args: {
        stateMachineSchema: {
          states: {
            idle: {
              initial: 'internalState',
              events: {
                fetch: {
                  target: 'loading',
                },
              },
              states: {
                internalState: {
                  events: {
                    doNothing: {
                      target: 'idle',
                    },
                  },
                },
              },
            },
          },
        },
      },
      want: {
        'idle': {
          id: 'idle',
          initial: 'idle.internalState',
          parentId: null,
          transitions: [
            {
              target: ['loading'],
              source: 'idle',
              events: ['fetch'],
              cond: [],
            },
          ],
          states: {
            'idle.internalState': 'idle.internalState',
          },
          onEntry: [],
          onExit: [],
        },
        'idle.internalState': {
          id: 'idle.internalState',
          parentId: 'idle',
          transitions: [
            {
              target: ['idle'],
              source: 'idle.internalState',
              events: ['doNothing'],
              cond: [],
            },
          ],
          onEntry: [],
          onExit: [],
        },
      },
    },

    {
      name: 'should return a correct hash of the deeper compound states',
      args: {
        stateMachineSchema: {
          states: {
            idle: {
              initial: 'internalState',
              events: {
                fetch: {
                  target: 'loading',
                },
              },
              states: {
                internalState: {
                  initial: 'subinternal',
                  events: {
                    doNothing: {
                      target: 'idle',
                    },
                  },
                  states: {
                    subinternal: {
                      events: {
                        goSomewhere: {
                          target: 'loading',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      want: {
        'idle': {
          id: 'idle',
          initial: 'idle.internalState',
          parentId: null,
          transitions: [
            {
              target: ['loading'],
              source: 'idle',
              events: ['fetch'],
              cond: [],
            },
          ],
          states: {
            'idle.internalState': 'idle.internalState',
          },
          onEntry: [],
          onExit: [],
        },
        'idle.internalState': {
          id: 'idle.internalState',
          parentId: 'idle',
          initial: 'idle.internalState.subinternal',
          transitions: [
            {
              target: ['idle'],
              source: 'idle.internalState',
              events: ['doNothing'],
              cond: [],
            },
          ],
          states: {
            'idle.internalState.subinternal': 'idle.internalState.subinternal',
          },
          onEntry: [],
          onExit: [],
        },
        'idle.internalState.subinternal': {
          id: 'idle.internalState.subinternal',
          parentId: 'idle.internalState',
          transitions: [
            {
              target: ['loading'],
              source: 'idle.internalState.subinternal',
              events: ['goSomewhere'],
              cond: [],
            },
          ],
          onEntry: [],
          onExit: [],
        },
      },
    },
  ];

  tests.forEach((tt) => {
    it(tt.name, () => {
      expect(NewStateHashFromSchema(tt.args.stateMachineSchema)).toEqual(
        tt.want
      );
    });
  });
});
