import { predicate, compare } from './types';
import { List } from "./List";

describe('List', () => {
  describe('head()', () => {
    type fields = {
      list: number[];
    };

    const tests: {
      name: string;
      fields: fields;
      want: number;
    }[] = [{
      name: 'should return the first element',
      fields: {list: [42]},
      want: 42
    }, {
      name: 'should return the first element when there are more than one',
      fields: {list: [42, 56, 78]},
      want: 42
    }];

    tests.forEach(tt => {
      it(tt.name, () => {
        const list = new List(tt.fields.list);
        expect(list.head()).toBe(tt.want);
      });
    });
  });

  describe('tail()', () => {
    type fields = {
      list: number[];
    };

    const tests: {
      name: string;
      fields: fields;
      want: number;
    }[] = [{
      name: 'should return the last element',
      fields: {list: [42]},
      want: 42
    }, {
      name: 'should return the last element when there are more than one',
      fields: {list: [42, 56, 78]},
      want: 78
    }];

    tests.forEach(tt => {
      it(tt.name, () => {
        const list = new List(tt.fields.list);
        expect(list.tail()).toBe(tt.want);
      });
    });
  });

  describe('append()', () => {
    type fields = {
      list?: number[];
    }

    type args = {
      elem: number;
    };

    const tests: {
      name: string;
      fields: fields;
      args: args;
      want: List<number>;
    }[] = [{
      name: 'should add a new element at the end of the empty array',
      fields: {list:[]},
      args: {elem: 42},
      want: new List([42])
    },{
      name: 'should add a new element at the end of the existing array',
      fields: {list:[42, 24]},
      args: {elem: 8},
      want: new List([42, 24, 8])
    }];

    tests.forEach(tt => {
      it(tt.name, () => {
        const list = new List(tt.fields.list);

        expect(list.append(tt.args.elem)).toEqual(tt.want);
      });
    });
  });

  describe('filter()', () => {
    type fields = {
      list?: number[];
    }

    type args = {
      predicate: predicate<number>;
    };

    const tests: {
      name: string;
      fields: fields;
      args: args;
      want: List<number>;
    }[] = [{
      name: 'should return an empty array when the list is empty',
      fields: {list:[]},
      args: {predicate: Boolean},
      want: new List([])
    },{
      name: 'passing isEven should filter only even numbers',
      fields: {list:[42, 3, 56, 93, 23, 45, 24]},
      args: {predicate: (n: number) => n % 2 === 0},
      want: new List([42, 56, 24])
    }];

    tests.forEach(tt => {
      it(tt.name, () => {
        const list = new List(tt.fields.list);

        expect(list.filter(tt.args.predicate)).toEqual(tt.want);
      });
    });
  });

  describe('some()', () => {
    type fields = {
      list?: number[];
    }

    type args = {
      predicate: predicate<number>;
    };

    const tests: {
      name: string;
      fields: fields;
      args: args;
      want: boolean;
    }[] = [{
      name: 'should return false when the list is empty',
      fields: {list:[]},
      args: {predicate: Boolean},
      want: false
    },{
      name: 'passing isEven should return true when at least one number is even',
      fields: {list:[3, 93, 42, 23, 45]},
      args: {predicate: (n: number) => n % 2 === 0},
      want: true
    },{
      name: 'passing isEven should return false when any number is even',
      fields: {list:[3, 93, 43, 23, 45]},
      args: {predicate: (n: number) => n % 2 === 0},
      want: false
    }];

    tests.forEach(tt => {
      it(tt.name, () => {
        const list = new List(tt.fields.list);

        expect(list.some(tt.args.predicate)).toEqual(tt.want);
      });
    });
  });

  describe('every()', () => {
    type fields = {
      list?: number[];
    }

    type args = {
      predicate: predicate<number>;
    };

    const tests: {
      name: string;
      fields: fields;
      args: args;
      want: boolean;
    }[] = [{
      name: 'should return true when the list is empty',
      fields: {list:[]},
      args: {predicate: Boolean},
      want: true
    },{
      name: 'passing isEven should return false when only some number are even',
      fields: {list:[3, 93, 42, 23, 45]},
      args: {predicate: (n: number) => n % 2 === 0},
      want: false
    },{
      name: 'passing isEven should return false when no number is even',
      fields: {list:[3, 93, 43, 23, 45]},
      args: {predicate: (n: number) => n % 2 === 0},
      want: false
    },{
      name: 'passing isEven should return true when all number are even',
      fields: {list:[42, 24, 8, 46, 54, 98]},
      args: {predicate: (n: number) => n % 2 === 0},
      want: true
    }];

    tests.forEach(tt => {
      it(tt.name, () => {
        const list = new List(tt.fields.list);

        expect(list.every(tt.args.predicate)).toEqual(tt.want);
      });
    });
  });

  describe('sort()', () => {
    type fields = {
      list: number[];
    };

    type args = {
      compare: compare<number>;
    };

    const tests: {
      name: string,
      fields: fields;
      args?: args;
      want: List<number>;
    }[] = [{
      name: 'should return an empty list when its empty',
      fields: {list: []},
      want: new List([])
    }, {
      name: 'should sort the list',
      fields: {list: [4,6,5,1,3,2]},
      want: new List([1,2,3,4,5,6])
    }, {
      name: 'should sort the list base on the compare function',
      fields: {list: [4,6,5,1,3,2]},
      args: {compare: (a: number, b: number): number => {
        if (b < a) return -1;
        else if (b == a) return 0;
        return 1;
      }},
      want: new List([6,5,4,3,2,1])
    }];

    tests.forEach(tt => {
      it(tt.name, () => {
        const list = new List(tt.fields.list);
        const compare = tt.args && tt.args.compare;
        expect(list.sort(compare)).toEqual(tt.want);
      });
    })
  })
});
