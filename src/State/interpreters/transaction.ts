import {EventSchema} from '../../Schema/TransitionSchema';
import {Transition} from '../../Transition';

export function NewTransactionFromEventSchema(
  eventSchema: EventSchema,
  partialTransition: Partial<Transition>
): Transition {
  return {
    events: partialTransition.events,
    target: partialTransition.target,
    source: partialTransition.source,
    cond: eventSchema.cond || [],
  };
}
