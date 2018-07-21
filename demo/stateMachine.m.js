const stateMachine = {
  initial: 'idle',
  states: {
    idle: {
      events: {
        login: {
          target: 'sending',
        },
      },
    },
    sending: {
      events: {
        success: {
          target: 'idle',
        },
        error: {
          target: 'error',
        },
      },
    },
    error: {
      events: {
        target: 'sending',
      },
    },
  },
};

export default stateMachine;
