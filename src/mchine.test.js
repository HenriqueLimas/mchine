import mchine from './mchine';

describe('mchine', () => {
  let stateMachine;

  beforeEach(() => {
    stateMachine = {
      idle: {
        actions: {
          send(m) {
            m.changeStateTo('sending');
          },
        },
      },
      sending: {
        actions: {},
      },
    };
  });

  it('should not set the current state without passing the initial state', () => {
    const m = mchine(stateMachine);

    expect(m.currentState).toBeUndefined();
  });

  it('should set the current state as the initial state', () => {
    const m = mchine(stateMachine, 'idle');

    expect(m.currentState).toBeDefined();
  });

  it('should call the action', () => {
    const mkSend = jest.fn().mockImplementation((m, email, password) => {});
    stateMachine.idle.actions.send = mkSend;

    const m = mchine(stateMachine, 'idle');

    expect(mkSend.mock.calls).toHaveLength(0);

    const email = 'john@example.com';
    const password = 'Some_secure_password42';

    m.dispatch('send', email, password);

    expect(mkSend.mock.calls).toHaveLength(1);
    expect(mkSend.mock.calls[0][1]).toBe(email);
    expect(mkSend.mock.calls[0][2]).toBe(password);
  });

  describe('dispatch()', () => {
    it('should not throw an error when there is no current state', () => {
      const m = mchine(stateMachine);
      expect(() => {
        m.dispatch('send');
      }).not.toThrow();
    });
  });

  describe('history', () => {
    it('should return all states', () => {
      const m = mchine(stateMachine);

      expect(m.history).toHaveLength(0);

      m.changeStateTo('idle');
      expect(m.history).toHaveLength(1);

      m.dispatch('send');
      expect(m.history).toHaveLength(2);
    });
  });
});
