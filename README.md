# 🎲 mchine
A Simple State Machine

## Why?
Because State machine are sexy, and easy to use. Using a state machine will change how you think and develop 
a Front-end application. Think more on your view's state instead of his transactions, this will reduce 
a lot of the if else and make the code more maintanable.

## Install

```
npm install mchine
```

## How to use?

```js
import mchine from 'mchine';

const stateMachine = {
  idle: {
    actions: {
      login: (machine, email, password) => {
        machine.changeStateTo('sending')
        return API.login(email, password)
          .then(() => machine.dispatch('success'))
          .catch(() => machine.dispatch('error'));
        
      }
    }
  },
  sending: {
    actions: {
      success: machine => {
        machine.changeStateTo('idle');
      },
      error: machine => {
        machine.changeStateTo('error');
      }
    }
  }
};

const machine = mchine(stateMachine, 'idle');

machine.currentState; // [idle]

machine.dispatch('login', 'john@example.com', 'Some.secure.password42')
  .then(() => {
    machine.currentState; // [sending]
  });
  
machine.dispatch('i_do_not_exist_in_that_state', 42); // null
```

## References
- API was stolen from [The Rise of State Machine](https://www.smashingmagazine.com/2018/01/rise-state-machines/)
