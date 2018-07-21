import {CurrentState} from './State/types';
import {StateMachine} from './StateMachine/StateMachine';
import {StateMachineSchema} from './Schema/StateSchema/types';
import {newEvent} from './Event/event';

interface Mchine {
  transition(eventName: string, ...data: any[]): CurrentState;
  getCurrentState(): CurrentState;
}

export function mchine(stateMachineSchema: StateMachineSchema): Mchine {
  const stateMachine = new StateMachine(stateMachineSchema);

  return {
    transition(eventName: string, ...data: any[]): CurrentState {
      const event = newEvent(eventName, ...data);

      stateMachine.executeEvent(event);

      return stateMachine.getCurrentState();
    },
    getCurrentState(): CurrentState {
      return stateMachine.getCurrentState();
    },
  };
}
