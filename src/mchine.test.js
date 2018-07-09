import mchine from "./mchine";

describe("mchine", () => {
  let stateMachine;

  beforeEach(() => {
    stateMachine = {
      initial: 'idle',
      states: {
        idle: {
          actions: {
            send(m) {
              m.changeStateTo("sending");
            }
          }
        },
        sending: {
          actions: {}
        }
      }
    };
  });

  it("should set the current state as the initial state", () => {
    const m = mchine(stateMachine);

    expect(m.currentState).toBeDefined();
  });

  it("should call the action", () => {
    const mkSend = jest.fn().mockImplementation((m, email, password) => {});
    stateMachine.states.idle.actions.send = mkSend;

    stateMachine.initial = "idle";
    const m = mchine(stateMachine);

    expect(mkSend.mock.calls).toHaveLength(0);

    const email = "john@example.com";
    const password = "Some_secure_password42";

    m.dispatch("send", email, password);

    expect(mkSend.mock.calls).toHaveLength(1);
    expect(mkSend.mock.calls[0][1]).toBe(email);
    expect(mkSend.mock.calls[0][2]).toBe(password);
  });

  describe("dispatch()", () => {
    it("should not throw an error when there is no current state", () => {
      const m = mchine(stateMachine);
      expect(() => {
        m.dispatch("send");
      }).not.toThrow();
    });
  });

  describe("history", () => {
    it("should return all states", () => {
      const m = mchine(stateMachine);

      expect(m.history).toHaveLength(1);

      m.dispatch("send");
      expect(m.history).toHaveLength(2);
    });
  });

  describe("ParallelState", () => {
    beforeEach(() => {
      stateMachine = {
        parallel: true,
        states: {
          bold: {
            initial: 'on',
            states: {
              on: {
                actions: {
                  toggle: m => m.changeStateTo('bold.off')
                }
              },
              off: {
                actions: {
                  toggle: m => m.changeStateTo('bold.on')
                }
              }
            }
          },
          italic: {
            initial: 'on',
            states: {
              on: {
                actions: {
                  toggle: m => m.changeStateTo('italic.off')
                }
              },
              off: {
                actions: {
                  toggle: m => m.changeStateTo('italic.on')
                }
              }
            }
          }
        }
      };
    });

    it("should return all the states", () => {
      const m = mchine(stateMachine);

      expect(Object.keys(m.currentState)).toEqual(['bold', 'italic']);

      expect(m.currentState.bold.name).toBe('bold.on')
      expect(m.currentState.bold.parent).toBe('bold')
      expect(m.currentState.bold.actions).toEqual(stateMachine.states.bold.states.on.actions)

      expect(m.currentState.italic.name).toBe('italic.on')
      expect(m.currentState.italic.parent).toBe('italic')
      expect(m.currentState.italic.actions).toEqual(stateMachine.states.italic.states.on.actions)
    });
  });
});
