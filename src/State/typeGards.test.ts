import { State } from "./types";
import { isCompoundState, isAtomicState } from "./typeGards";

describe('isCompoundState()', () => {
  type fields = State;

  const tests: {
    name: string;
    fields: fields;
    want: boolean;
  }[] = [{
    name: 'should return true when it has children',
    fields: { id: '1', initial: 'idle', states: {}},
    want: true
  }, {
    name: 'should return false when it doesn\'t have children',
    fields: { id: '1', parentId: '1', initial: 'idle' },
    want: false
  }];

  tests.forEach(tt => {
    it(tt.name, () => {
      expect(isCompoundState(tt.fields)).toBe(tt.want)
    });
  });
});

describe('isAtomicState()', () => {
  type fields = State;

  const tests: {
    name: string;
    fields: fields;
    want: boolean;
  }[] = [{
    name: 'should return true when it doesn\'t have children',
    fields: { id: '1', parentId: '1', initial: 'idle' },
    want: true
  },{
    name: 'should return false when it has children',
    fields: { id: '1', initial: 'idle', states: {}},
    want: false
  }];

  tests.forEach(tt => {
    it(tt.name, () => {
      expect(isAtomicState(tt.fields)).toBe(tt.want)
    });
  });
});