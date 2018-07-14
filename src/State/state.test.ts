import {CHILD_DELIMITER} from '../constants';
import {StateID} from './types';
import {ConcatStateIDs} from './state';

describe('concatStateIDs', () => {
  type args = {
    stateIDs: StateID[];
  };

  const tests: {
    name: string;
    args: args;
    want: StateID;
  }[] = [
    {
      name: 'should return an empty string when no state was passed',
      args: {stateIDs: []},
      want: '',
    },
    {
      name: 'should return the stateID when one state was passed',
      args: {stateIDs: ['idle']},
      want: 'idle',
    },
    {
      name: 'should return the stateID concatanated when two state was passed',
      args: {stateIDs: ['idle', 'child']},
      want: 'idle' + CHILD_DELIMITER + 'child',
    },
    {
      name:
        'should return the stateID concatanated when three or more state was passed',
      args: {stateIDs: ['idle', 'child', 'grandchild']},
      want: 'idle' + CHILD_DELIMITER + 'child' + CHILD_DELIMITER + 'grandchild',
    },
  ];

  tests.forEach((tt) => {
    it(tt.name, () => {
      expect(ConcatStateIDs(...tt.args.stateIDs)).toBe(tt.want);
    });
  });
});
