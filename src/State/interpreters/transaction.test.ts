import {Transition} from '../../Transition';
import {EventSchema} from '../../Schema/TransitionSchema';
import {newTransactionFromEventSchema} from './transaction';

describe('NewTransactionFromEventSchema', () => {
  type args = {
    eventSchema: EventSchema;
    partialTransition: Partial<Transition>;
  };

  const tests: {
    name: string;
    args: args;
    want: Transition;
  }[] = [
    {
      name: 'should return the new transaction',
      args: {
        eventSchema: {target: 'idle', cond: []},
        partialTransition: {target: ['idle'], events: [], source: 'initial'},
      },
      want: {
        cond: [],
        target: ['idle'],
        source: 'initial',
        events: [],
      },
    },

    {
      name: 'should default cond to an empty array',
      args: {
        eventSchema: {target: 'idle'},
        partialTransition: {target: ['idle'], events: [], source: 'initial'},
      },
      want: {
        cond: [],
        target: ['idle'],
        source: 'initial',
        events: [],
      },
    },
  ];

  tests.forEach((tt) => {
    it(tt.name, () => {
      expect(
        newTransactionFromEventSchema(
          tt.args.eventSchema,
          tt.args.partialTransition
        )
      ).toEqual(tt.want);
    });
  });
});
