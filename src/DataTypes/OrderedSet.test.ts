import { List } from './List';
import { OrderedSet } from './OrderedSet';
import { predicate } from './types';

describe('OrderedSet', () => {
  describe('add()', () => {
    type fields = {
      fromArray?: number[];
    };

    type args = {
      item: number;
    }

    const tests: {
      name: string;
      fields: fields;
      args: args;
      want: OrderedSet<number>;
    }[] = [{
      name: 'Should add the element in a empty set',
      fields: {},
      args: {item:42},
      want: new OrderedSet<number>([42])
    }, {
      name: 'Should add the element in the existing set',
      fields: { fromArray: [53, 45, 24]},
      args: {item:42},
      want: new OrderedSet<number>([53, 45, 24, 42])
    }];

    tests.forEach(tt => {
      it(tt.name, () => {
        const orderedSet = new OrderedSet<number>(tt.fields.fromArray);
        orderedSet.add(tt.args.item);

        expect(orderedSet).toEqual(tt.want);
      });
    });
  });

  describe('delete()', () => {
    type fields = {
      fromArray?: number[];
    };

    type args = {
      item: number;
    }

    const tests: {
      name: string;
      fields: fields;
      args: args;
      want: OrderedSet<number>;
    }[] = [{
      name: 'Should do nothing when the set is empty',
      fields: {},
      args: {item:42},
      want: new OrderedSet<number>()
    }, {
      name: 'Should remove the element in the set',
      fields: { fromArray: [53, 45, 24, 42]},
      args: {item:42},
      want: new OrderedSet<number>([53, 45, 24])
    }, {
      name: 'Should remove the element in the set and maintain the order',
      fields: { fromArray: [53, 46, 42, 45, 24]},
      args: {item:42},
      want: new OrderedSet<number>([53, 46, 45, 24])
    }];

    tests.forEach(tt => {
      it(tt.name, () => {
        const orderedSet = new OrderedSet<number>(tt.fields.fromArray);
        orderedSet.delete(tt.args.item);

        expect(orderedSet).toEqual(tt.want);
      });
    });
  });

  describe('union()', () => {
    type fields = {
      fromArray?: number[];
    };

    type args = {
      item: OrderedSet<number>;
    }

    const tests: {
      name: string;
      fields: fields;
      args: args;
      want: OrderedSet<number>;
    }[] = [{
      name: 'Should union the elements in the empty set',
      fields: {},
      args: {item: new OrderedSet<number>([42])},
      want: new OrderedSet<number>([42])
    }, {
      name: 'Should union the element in the set',
      fields: { fromArray: [53, 45, 24, 42]},
      args: {item: new OrderedSet<number>([56, 78, 32, 90])},
      want: new OrderedSet<number>([53, 45, 24, 42, 56, 78, 32, 90])
    }, {
      name: 'Should union without repeat the elements',
      fields: { fromArray: [53, 46, 42, 45, 24]},
      args: {item: new OrderedSet<number>([42, 12, 45])},
      want: new OrderedSet<number>([53, 46, 42, 45, 24, 12])
    }];

    tests.forEach(tt => {
      it(tt.name, () => {
        const orderedSet = new OrderedSet<number>(tt.fields.fromArray);
        orderedSet.union(tt.args.item);

        expect(orderedSet).toEqual(tt.want);
      });
    });
  });

  describe('isMember()', () => {
    type fields = {
      fromArray?: number[];
    };

    type args = {
      item: number;
    }

    const tests: {
      name: string;
      fields: fields;
      args: args;
      want: boolean;
    }[] = [{
      name: 'Should returns false when the set is empty',
      fields: {},
      args: {item: 42},
      want: false
    }, {
      name: 'Should returns true when the element is in the set',
      fields: {fromArray: [53, 45, 24, 42]},
      args: {item: 24},
      want: true
    }, {
      name: 'Should false when the element is not in the set',
      fields: {fromArray: [53, 46, 42, 45, 24]},
      args: {item: 23},
      want: false
    }];

    tests.forEach(tt => {
      it(tt.name, () => {
        const orderedSet = new OrderedSet<number>(tt.fields.fromArray);
        expect(orderedSet.isMember(tt.args.item)).toEqual(tt.want);
      });
    });
  });

  describe('some()', () => {
    type fields = {
      fromArray?: number[];
    };

    type args = {
      predicate: predicate<number>;
    }

    const tests: {
      name: string;
      fields: fields;
      args: args;
      want: boolean;
    }[] = [{
      name: 'Should returns false when the set is empty',
      fields: {},
      args: {predicate: Boolean},
      want: false
    }, {
      name: 'Should returns true when predicate is true for an element in the set',
      fields: {fromArray: [53, 45, 24, 42]},
      args: {predicate: n => n % 2 === 0},
      want: true
    }, {
      name: 'Should returns false when no element returns true',
      fields: {fromArray: [53, 43, 45, 41, 29]},
      args: {predicate: n => n % 2 === 0},
      want: false
    }];

    tests.forEach(tt => {
      it(tt.name, () => {
        const orderedSet = new OrderedSet<number>(tt.fields.fromArray);
        expect(orderedSet.some(tt.args.predicate)).toEqual(tt.want);
      });
    });
  });

  describe('every()', () => {
    type fields = {
      fromArray?: number[];
    };

    type args = {
      predicate: predicate<number>;
    }

    const tests: {
      name: string;
      fields: fields;
      args: args;
      want: boolean;
    }[] = [{
      name: 'Should returns true when the set is empty',
      fields: {},
      args: {predicate: Boolean},
      want: true
    }, {
      name: 'Should returns true when predicate is true for all elements in the set',
      fields: {fromArray: [52, 46, 24, 42]},
      args: {predicate: n => n % 2 === 0},
      want: true
    }, {
      name: 'Should returns false when at least one element returns false',
      fields: {fromArray: [53, 24, 46, 38]},
      args: {predicate: n => n % 2 === 0},
      want: false
    }];

    tests.forEach(tt => {
      it(tt.name, () => {
        const orderedSet = new OrderedSet<number>(tt.fields.fromArray);
        expect(orderedSet.every(tt.args.predicate)).toEqual(tt.want);
      });
    });
  });

  describe('hasIntersection()', () => {
    type fields = {
      fromArray?: number[];
    };

    type args = {
      orderedSet: OrderedSet<number>;
    }

    const tests: {
      name: string;
      fields: fields;
      args: args;
      want: boolean;
    }[] = [{
      name: 'Should returns false when the set is empty',
      fields: {},
      args: {orderedSet: new OrderedSet<number>()},
      want: false
    }, {
      name: 'Should returns false when the first set is empty',
      fields: {},
      args: {orderedSet: new OrderedSet<number>([2,3,4])},
      want: false
    }, {
      name: 'Should returns false when the second set is empty',
      fields: {fromArray: [53, 24, 46, 38]},
      args: {orderedSet: new OrderedSet<number>()},
      want: false
    }, {
      name: 'Should returns true when one element in the first set intersect the other',
      fields: {fromArray: [53, 24, 46, 38]},
      args: {orderedSet: new OrderedSet<number>([42, 46])},
      want: true
    }];

    tests.forEach(tt => {
      it(tt.name, () => {
        const orderedSet = new OrderedSet<number>(tt.fields.fromArray);
        expect(orderedSet.hasIntersection(tt.args.orderedSet)).toEqual(tt.want);
      });
    });
  });

  describe('isEmpty()', () => {
    type fields = {
      fromArray?: number[];
    };

    const tests: {
      name: string;
      fields: fields;
      want: boolean;
    }[] = [{
      name: 'Should returns true when the set is empty',
      fields: {},
      want: true
    }, {
      name: 'Should returns false when the set is not empty',
      fields: {fromArray: [52, 46, 24, 42]},
      want: false
    }];

    tests.forEach(tt => {
      it(tt.name, () => {
        const orderedSet = new OrderedSet<number>(tt.fields.fromArray);
        expect(orderedSet.isEmpty()).toEqual(tt.want);
      });
    });
  });

  describe('clear()', () => {
    type fields = {
      fromArray?: number[];
    };

    const tests: {
      name: string;
      fields: fields;
      want: boolean;
    }[] = [{
      name: 'Should returns true when the set is empty',
      fields: {},
      want: true
    }, {
      name: 'Should returns true when the set is not empty',
      fields: {fromArray: [52, 46, 24, 42]},
      want: true
    }];

    tests.forEach(tt => {
      it(tt.name, () => {
        const orderedSet = new OrderedSet<number>(tt.fields.fromArray);
        orderedSet.clear();
        expect(orderedSet.isEmpty()).toEqual(tt.want);
      });
    });
  });

  describe('toList()', () => {
    type fields = {
      fromArray?: number[];
    };

    type args = {
      union: OrderedSet<number>;
    }

    const tests: {
      name: string;
      fields: fields;
      want: List<number>;
      args?: args;
    }[] = [{
      name: 'Should returns empty list when the set is empty',
      fields: {},
      want: new List<number>()
    }, {
      name: 'Should returns the list in the same order as inserted',
      fields: {fromArray: [52, 46, 24, 42]},
      want: new List<number>([52, 46, 24, 42])
    }, {
      name: 'Should returns the unified list in the same order as inserted',
      fields: {fromArray: [52, 46, 24, 42]},
      args: {union: new OrderedSet([23,41,42,56])},
      want: new List<number>([52, 46, 24, 42, 23, 41, 56])
    }];

    tests.forEach(tt => {
      it(tt.name, () => {
        const orderedSet = new OrderedSet<number>(tt.fields.fromArray);

        if (tt.args && tt.args.union) {
          orderedSet.union(tt.args.union)
        }

        expect(orderedSet.toList()).toEqual(tt.want);
      });
    });
  });
});
