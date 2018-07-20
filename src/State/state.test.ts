import {CHILD_DELIMITER} from '../constants';
import {StateID, StateHash} from './types';
import {
  concatStateIDs,
  getProperAncestors,
  isDescendant,
  findLCCA,
} from './state';
import {List} from '../DataTypes/List';
import {newStateFromSchema} from './interpreters/state';

describe('ConcatStateIDs()', () => {
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
      expect(concatStateIDs(...tt.args.stateIDs)).toBe(tt.want);
    });
  });
});

describe('GetProperAncestors()', () => {
  type args = {
    state1: StateID;
    state2?: StateID;
  };

  const tests: {
    name: string;
    args: args;
    want: List<StateID>;
  }[] = [
    {
      name: 'should return the set of all ancestor of state1 in ancestry order',
      args: {state1: 'grandparentparent.grandparent.parent.child.grandchild'},
      want: new List<StateID>([
        'grandparentparent.grandparent.parent.child',
        'grandparentparent.grandparent.parent',
        'grandparentparent.grandparent',
        'grandparentparent',
      ]),
    },
    {
      name:
        'should return the set of all ancestor of state1 in ancestry order until state2 not included',
      args: {
        state1: 'grandparentparent.grandparent.parent.child.grandchild',
        state2: 'grandparentparent.grandparent',
      },
      want: new List<StateID>([
        'grandparentparent.grandparent.parent.child',
        'grandparentparent.grandparent.parent',
      ]),
    },
  ];

  tests.forEach((tt) => {
    it(tt.name, () => {
      expect(getProperAncestors(tt.args.state1, tt.args.state2)).toEqual(
        tt.want
      );
    });
  });
});

describe('IsDescendant()', () => {
  type args = {
    state1: StateID;
    state2: StateID;
  };

  const tests: {
    name: string;
    args: args;
    want: boolean;
  }[] = [
    {
      name: 'should return true when state1 is a descendent of state2',
      args: {state1: 'parent.child', state2: 'parent'},
      want: true,
    },
    {
      name: 'should return false when state1 is not a descendent of state2',
      args: {state1: 'parent2', state2: 'parent'},
      want: false,
    },
    {
      name:
        'should return true when state1 is a descendent of state2 in multilevel',
      args: {
        state1: 'grandparent.parent.child.grandchild',
        state2: 'grandparent.parent',
      },
      want: true,
    },
  ];

  tests.forEach((tt) => {
    it(tt.name, () => {
      expect(isDescendant(tt.args.state1, tt.args.state2)).toBe(tt.want);
    });
  });
});

describe('FindLCCA()', () => {
  type args = {
    stateHash: StateHash;
    stateList: List<StateID>;
  };

  const tests: {
    name: string;
    args: args;
    want: StateID;
  }[] = [
    {
      name:
        'should return the first compound ancestor of the state in the list',
      args: {
        stateHash: {
          'parent': newStateFromSchema(
            {initial: '', states: {}},
            {id: 'parent'}
          ),
          'parent.child': newStateFromSchema(
            {initial: '', states: {}},
            {id: 'parent.child'}
          ),
          'parent.child.grandchild': newStateFromSchema(
            {},
            {id: 'parent.child.grandchild'}
          ),
        },
        stateList: new List<StateID>(['parent.child.grandchild']),
      },
      want: 'parent.child',
    },

    {
      name:
        'should return the first compound ancestor of all the state in the list',
      args: {
        stateHash: {
          'parent': newStateFromSchema(
            {initial: '', states: {}},
            {id: 'parent'}
          ),
          'parent.child': newStateFromSchema(
            {initial: '', states: {}},
            {id: 'parent.child'}
          ),
          'parent.brother': newStateFromSchema({}, {id: 'parent.brother'}),
        },
        stateList: new List<StateID>(['parent.child', 'parent.brother']),
      },
      want: 'parent',
    },
  ];

  tests.forEach((tt) => {
    it(tt.name, () => {
      expect(findLCCA(tt.args.stateHash, tt.args.stateList)).toEqual(tt.want);
    });
  });
});
