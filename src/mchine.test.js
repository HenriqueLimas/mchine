import mchine from './mchine'

describe('mchine', () => {
    const stateMachine = {
        idle: {
            actions: {
                send() {}
            }
        }
    };

    it('should set the current state as the initial state', () => {
        const m = mchine(stateMachine, 'idle');

        expect(m.currentState.actions).toEqual(stateMachine.actions)
    });
})
