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

    {
      name: 'should return a hash of the parallel states',
      args: {
        stateMachineSchema: {
          parallel: true,
          states: {
            bold: {
              initial: 'internalBoldState',
              events: {
                fetch: {
                  target: 'loading',
                },
              },
              states: {
                internalBoldState: {
                  events: {
                    doNothing: {
                      target: 'bold',
                    },
                  },
                },
              },
            },
            font: {
              initial: 'internalFontState',
              events: {
                fetch: {
                  target: 'loading',
                },
              },
              states: {
                internalFontState: {
                  events: {
                    doNothing: {
                      target: 'font',
                    },
                  },
                },
              },
            },
          },
        },
      },
      want: {
        'bold': {
          id: 'bold',
          initial: 'bold.internalBoldState',
          parentId: null,
          transitions: [
            {
              target: ['loading'],
              source: 'bold',
              events: ['fetch'],
              cond: [],
            },
          ],
          states: {
            'bold.internalBoldState': 'bold.internalBoldState',
          },
          onEntry: [],
          onExit: [],
        },
        'bold.internalBoldState': {
          id: 'bold.internalBoldState',
          parentId: 'bold',
          transitions: [
            {
              target: ['bold'],
              source: 'bold.internalBoldState',
              events: ['doNothing'],
              cond: [],
            },
          ],
          onEntry: [],
          onExit: [],
        },

        'font': {
          id: 'font',
          initial: 'font.internalFontState',
          parentId: null,
          transitions: [
            {
              target: ['loading'],
              source: 'font',
              events: ['fetch'],
              cond: [],
            },
          ],
          states: {
            'font.internalFontState': 'font.internalFontState',
          },
          onEntry: [],
          onExit: [],
        },
        'font.internalFontState': {
          id: 'font.internalFontState',
          parentId: 'font',
          transitions: [
            {
              target: ['font'],
              source: 'font.internalFontState',
              events: ['doNothing'],
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
