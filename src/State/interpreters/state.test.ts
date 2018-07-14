import {CHILD_DELIMITER} from './../../constants';
import {StateSchema} from './../../Schema/StateSchema/types';
import {State} from '../types';
import {NewStateFromSchema} from './state';
describe('NewStateFromSchema()', () => {
  type args = {
    stateSchema: StateSchema;
    partialState: Partial<State>;
  };

  const tests: {
    name: string;
    args: args;
    want: State;
  }[] = [
    {
      name: 'should return an atomic state',
      args: {
        stateSchema: {},
        partialState: {parentId: 'idle', id: 'loading'},
      },
      want: {
        id: 'loading',
        parentId: 'idle',
        transitions: [],
        onEntry: [],
        onExit: [],
      },
    },

    {
      name: 'should return a compound state',
      args: {
        stateSchema: {initial: 'loading', states: {loading: {}}},
        partialState: {parentId: null, id: 'idle'},
      },
      want: {
        id: 'idle',
        initial: 'idle' + CHILD_DELIMITER + 'loading',
        parentId: null,
        transitions: [],
        onEntry: [],
        onExit: [],
        states: {
          ['idle' + CHILD_DELIMITER + 'loading']:
            'idle' + CHILD_DELIMITER + 'loading',
        },
      },
    },

    {
      name: 'should return a parallel state',
      args: {
        stateSchema: {parallel: true, states: {loading: {}}},
        partialState: {parentId: null, id: 'idle'},
      },
      want: {
        id: 'idle',
        parallel: true,
        parentId: null,
        transitions: [],
        onEntry: [],
        onExit: [],
        states: {
          ['idle' + CHILD_DELIMITER + 'loading']:
            'idle' + CHILD_DELIMITER + 'loading',
        },
      },
    },
  ];

  tests.forEach((tt) => {
    it(tt.name, () => {
      expect(
        NewStateFromSchema(tt.args.stateSchema, tt.args.partialState)
      ).toEqual(tt.want);
    });
  });
});
