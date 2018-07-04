const API = {
  login: () => new Promise((_, r) => setTimeout(r, 2000))
};

const login = (machine, email, password) => {
  console.log('sending')
  machine.changeStateTo('sending')
  return API.login(email, password)
    .then(() => machine.dispatch('success'))
    .catch(() => machine.dispatch('error'));

};

const stateMachine = {
  idle: {
    actions: {
      login
    }
  },
  sending: {
    components: {
      email: {
        disabled: true
      },
      password: {
        disabled: true
      },
      login: {
        disabled: true
      },
      loading: true
    },
    actions: {
      success: machine => {
        machine.changeStateTo('idle');
      },
      error: machine => {
        machine.changeStateTo('error');
      }
    }
  },
  error: {
    components: {
      error: { visible: true }
    },
    actions: {
      login
    },
  }
};

export default stateMachine;
