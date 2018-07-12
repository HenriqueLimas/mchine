import { StateSchema } from "./types";
import { isCompoundStateSchema, isAtomicStateSchema, isParallelStateSchema } from "./typeGards";

describe('isParallelStateSchema()', () => {
  type fields = StateSchema;

  const tests: {
    name: string;
    fields: fields;
    want: boolean;
  }[] = [{
    name: 'should return true when parallel is true',
    fields: { parallel: true, states: {}},
    want: true
  }, {
    name: 'should return false when it doesn\'t have parallel as true',
    fields: { onEntry: [] },
    want: false
  }];

  tests.forEach(tt => {
    it(tt.name, () => {
      expect(isParallelStateSchema(tt.fields)).toBe(tt.want)
    });
  });
});

describe('isCompoundStateSchema()', () => {
  type fields = StateSchema;

  const tests: {
    name: string;
    fields: fields;
    want: boolean;
  }[] = [{
    name: 'should return true when it has children',
    fields: { initial: 'idle', states: {}},
    want: true
  }, {
    name: 'should return false when it doesn\'t have children',
    fields: { onEntry: [] },
    want: false
  }];

  tests.forEach(tt => {
    it(tt.name, () => {
      expect(isCompoundStateSchema(tt.fields)).toBe(tt.want)
    });
  });
});

describe('isAtomicStateSchema()', () => {
  type fields = StateSchema;

  const tests: {
    name: string;
    fields: fields;
    want: boolean;
  }[] = [{
    name: 'should return true when it doesn\'t have children',
    fields: { onEntry: [] },
    want: true
  },{
    name: 'should return false when it has children',
    fields: { initial: 'idle', states: {}},
    want: false
  }];

  tests.forEach(tt => {
    it(tt.name, () => {
      expect(isAtomicStateSchema(tt.fields)).toBe(tt.want)
    });
  });
});