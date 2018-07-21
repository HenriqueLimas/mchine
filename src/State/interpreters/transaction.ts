import {EventSchema} from '../../Schema/TransitionSchema';
import {Transition} from '../../Transition';
import {newTransition} from '../../Transition/transition';

export function newTransactionFromEventSchema(
  eventSchema: EventSchema,
  partialTransition: Partial<Transition>
): Transition {
  return newTransition({
    events: partialTransition.events,
    target: partialTransition.target,
    source: partialTransition.source,
    cond: eventSchema.cond,
    actions: eventSchema.actions,
  });
}
