import { Queue } from "./Queue";

describe('Queue', () => {
  describe('enqueue()', () => {
    type fields = {
      fromArray?: number[];
    };

    type args = {
      item: number;
    };

    const tests: {
      name: string;
      fields: fields;
      args: args;
      want: Queue<number>;
    }[] = [{ 
      name: 'should add the element in a empty queue',
      fields: {},
      args: {item: 42},
      want: new Queue<number>([42])
    }, { 
      name: 'should add the element at the end of the existing queue',
      fields: { fromArray: [23, 56, 89]},
      args: {item: 42},
      want: new Queue<number>([23, 56, 89, 42])
    }];

    tests.forEach(tt => {
      it(tt.name, () => {
        const queue = new Queue(tt.fields.fromArray);
        queue.enqueue(tt.args.item);
        expect(queue).toEqual(tt.want);
      });
    });
  });

  describe('dequeue()', () => {
    type fields = {
      fromArray?: number[];
    };

    const tests: {
      name: string;
      fields: fields;
      want: Queue<number>;
      returns: number;
    }[] = [{ 
      name: 'should not remove from an empty queue',
      fields: {},
      want: new Queue<number>([]),
      returns: undefined
    }, { 
      name: 'should remove the first element from the queue',
      fields: { fromArray: [42, 23, 56, 89]},
      want: new Queue<number>([23, 56, 89]),
      returns: 42
    }];

    tests.forEach(tt => {
      it(tt.name, () => {
        const queue = new Queue(tt.fields.fromArray);
        const removed = queue.dequeue();
        expect(queue).toEqual(tt.want);
        expect(removed).toEqual(removed);
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
      name: 'should return true when is empty',
      fields: {},
      want: true
    }, { 
      name: 'should return false when is not empty',
      fields: { fromArray: [42, 23, 56, 89]},
      want: false
    }];

    tests.forEach(tt => {
      it(tt.name, () => {
        const queue = new Queue(tt.fields.fromArray);
        expect(queue.isEmpty()).toEqual(tt.want);
      });
    });
  });
});