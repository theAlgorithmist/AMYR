import {
  FSMStateOutput,
  StateMachineDefinition, StateTransition,
  transFunction
} from "../../../../models/state-machine-models";

import { FiniteStateMachine } from "../../finite-state-machine/finite-state-machine";
import { DecisionTreeAction } from "../../../../models/decision-tree-action";

import { Observer } from "rxjs";

// This structure represents the amount to be paid as a fraction of a dollar, i.e. 15 cents = 0.15.  A great way
// to show off numerical (rounding) issues.
interface Payment
{
  p: number;
  n: number;
  d: number;
  q: number;
  amt: number;
}

// This structure represents the amount to be paid as an integer number of cents, since the amount is always less
// than a dollar.  The 'amount' property represents the original amount and the 'change' property is the currently
// leftover change.
interface Change
{
  p: number;
  n: number;
  d: number;
  q: number;
  amount: number;
  change: number;
}

const PENNIES          = 'p';
const NICKELS          = 'n';
const QUARTERS         = 'q';
const DIMES            = 'd';
const PAYMENT_COMPLETE = 'c';
const COMPLETE         = 'c';
const NONE             = "";

// not good - coin values as fraction of a dollar ... more rounding problems
const COIN_VALUE: Record<string, number> = {
  p: 0.01,
  n: 0.05,
  d: 0.1,
  q: 0.25
};

// better - coin values as integers, normalized to value of a penny
const COIN_VALUES: Record<string, number> = {
  p: 1,
  n: 5,
  d: 10,
  q: 25
};

// create a Change model from input that is fraction of a dollar, i.e. 15 cents = 0.15, one quarter = 0.25
const createChange = (value: number): Change =>
{
  const coinValue       = value * 100;
  const coinage: number = Math.max(0, Math.min(coinValue, 99));
  return {
    p: 0,
    n: 0,
    d: 0,
    q: 0,
    amount: coinage,
    change: coinage
  }
}

const ELEVATOR_NONE = '[Elevator] None';

// pre-defined transition functions for various machines; most of these are from internet and textbook
// examples - you will find them almost anywhere in the literature.  These functions have room for
// expansion, but could be compacted if they are never extended beyond current use.  That is left as
// an exercise.

// binary sequence with an even number of zeros (note that it is not absolutely required to include the 'state' argument)
const f1: transFunction<number> = (data: number) => {
  return data == 1 ? {to: 'S1'} : (data == 0 ? {to: 'S2'} : {to: 'S1'})
};

const f2: transFunction<number> = (data: number) => {
  return data == 1 ? {to: 'S2'} : (data == 0 ? {to: 'S1'} : {to: 'S2'})
};

// string generator from alphabet (a, b, c, d)
const f12: transFunction<string> = (data: string) => {
  return data == 'a' ? {to: 'S2'} : {to: 'S1'}
};

const f22: transFunction<string> = (data: string) => {
  return data == 'a' ? {to: 'S2'} : (data == 'b' ? {to: 'S1'} : (data == 'c' ? {to: 'S4'} : {to: 'S2'}))
};

const f32: transFunction<string> = (data: string) => {
  return data == 'a' ? {to: 'S1'} : (data == 'b' ? {to: 'S4'} : {to: 'S3'})
};

const f42: transFunction<string> = (data: string) => {
  return data == 'd' ? {to: 'S3'} : {to: 'S4'}
};

// all binary sequences that end with a 1
const f13: transFunction<number> = (data: number) => {
  return data == 0 ? {to: 'S1'} : (data == 1 ? {to: 'S2'} : {to: 'S1'})
};

const f23: transFunction<number> = (data: number) => {
  return data == 1 ? {to: 'S2'} : (data == 0 ? {to: 'S1'} : {to: 'S2'})
};

// elevator between two floors
const f14: transFunction<string> = (data: string) => {
  return data == 'UP' ? {to: 'FIRST'} : (data == 'DOWN' ? {to: 'GROUND'} : {to: 'GROUND'})
};
const f24: transFunction<string> = (data: string) => {
  return data == 'DOWN' ? {to: 'GROUND'} : (data == 'UP' ? {to: 'FIRST'} : {to: 'FIRST'})
};

// this is the hard way - trying to force-feed the complete change-making logic into a state machine and with
// all values as fractions of a dollar.
const payola: transFunction<Payment> = (pmt: Payment, state?: string): FSMStateOutput<Payment> => {
  // no error-checking to make this very compact
  const coinage: string  = state as string;
  const value: number    = COIN_VALUE[coinage];

  // will this amount be applied to the payment?
  if (value <= pmt.amt) (pmt as unknown as Record<string, number>)[coinage]++;

  let leftOver: number   = pmt.amt >= value ? pmt.amt - COIN_VALUE[coinage] : pmt.amt;
  leftOver               = Math.abs(leftOver) <= 0.000001 ? 0 : leftOver;

  // round to nearest 0.01
  let r: number = Math.floor(1/0.01);
  r             = r == 0 ? 1.0/0.01 : r;
  leftOver      = Math.round(leftOver*r)/r;
  pmt.amt       = leftOver;

  let to = 'c';
  if (leftOver >= 0.25) to = QUARTERS;
  else if (leftOver >= 0.1) to = DIMES;
  else if (leftOver >= 0.05) to = NICKELS;
  else if (leftOver > 0) to = PENNIES

  return {
    to: to,
    data: pmt
  }
};

// a much better way - change is represented by integer amounts, normalized to number of pennies
const makeChange: transFunction<Change> = (pmt: Change, state?: string): FSMStateOutput<Change> => {
  if (pmt.change === 0) {
    return {
      to: 'c',
      data: pmt
    }
  };

  // sum current amounts
  const coinage: string = state as string;

  // can the current amount be applied to reduce the outstanding change due?
  const value: number  = COIN_VALUES[coinage];
  const apply: boolean = value <= pmt.change;

  let toState = '';
  if (apply)
  {
    (pmt as unknown as Record<string, number>)[coinage]++;
    pmt.change -= value;

    toState = pmt.change === 0 ? 'c': coinage;
  }
  else
  {
    if (coinage === QUARTERS) toState = DIMES;
    else if (coinage === DIMES) toState = NICKELS;
    else if (coinage === NICKELS) toState = PENNIES;
    else toState = PENNIES;
  }

  return {
    to: toState,
    data: pmt
  }
};

const changeMachineFactory = (): FiniteStateMachine<Change> =>
{
  const fsm: FiniteStateMachine<Change> = new FiniteStateMachine<Change>();

  // add states
  fsm.addState(PENNIES);
  fsm.addState(NICKELS);
  fsm.addState(QUARTERS);
  fsm.addState(DIMES);
  fsm.addState(PAYMENT_COMPLETE, true);  // 'complete' is the acceptance state

  fsm.addTransition('p', makeChange);
  fsm.addTransition('n', makeChange);
  fsm.addTransition('d', makeChange);
  fsm.addTransition('q', makeChange);

  return fsm;
};

const processChange = (fsm: FiniteStateMachine<Change>, change: Change): void => {
  let state: FSMStateOutput<Change> | null = fsm.next(change, QUARTERS);

  while (state?.to != COMPLETE) {
    state = fsm.next(change, state?.to);
  }
};

const machine1: StateMachineDefinition = {
  name: 'StringTest',
  initialState: "S1",
  alphabet: [
    'a',
    'b',
    'c',
    'd'
  ],
  states: [
    {
      name: 'S1',
      isAcceptance: false,
      transition: "return data == 'a' ? {to: 'S2'} : {to: 'S1'}"
    },
    {
      name: 'S2',
      isAcceptance: false,
      transition: "return data == 'a' ? {to: 'S2'} : (data == 'b' ? {to: 'S1'} : (data == 'c' ? {to: 'S4'} : {to: 'S2'}))"
    },
    {
      name: 'S3',
      isAcceptance: false,
      transition: "return data == 'a' ? {to: 'S1'} : (data == 'b' ? {to: 'S4'} : {to: 'S3'})"
    },
    {
      name: 'S4',
      isAcceptance: true,
      transition: "return data == 'd' ? {to: 'S3'} : {to: 'S4'}"
    },
  ]
};

const PMT_FUNCTION_SCRIPT = `
if (data.change === 0) {
    return {
      to: 'c',
      data: data
    }
  }

  const COIN_VALUES = {p: 1, n: 5, d: 10, q: 25 };
  const value = COIN_VALUES[state];
  const apply = value <= data.change;

  let toState = '';
  if (apply)
  {
    data[state]++;
    data.change -= value;

    toState = data.change === 0 ? 'c': state;
  }
  else
  {
    if (state === 'q') toState = 'd';
    else if (state === 'd') toState = 'n';
    else if (state === 'n') toState = 'p';
    else toState = 'p';
  }

  return {
    to: toState,
    data: data
  }`

// initial state is not important in this example.  Note that we can't use the COIN_VALUE helper since the
// execution context of the dynamic functions is different
const TheChangeMachine: StateMachineDefinition = {
  name: 'ChangeMachine',
  alphabet: [
    'p',
    'n',
    'd',
    'q',
  ],
  states: [
    {
      name: 'p',   // pennies
      isAcceptance: false,
      transition: PMT_FUNCTION_SCRIPT
    },
    {
      name: 'n',   // nickels
      isAcceptance: false,
      transition: PMT_FUNCTION_SCRIPT
    },
    {
      name: 'd',   // dimes
      isAcceptance: false,
      transition: PMT_FUNCTION_SCRIPT
    },
    {
      name: 'q',   // quarters
      isAcceptance: false,
      transition: PMT_FUNCTION_SCRIPT
    },
    {
      name: COMPLETE,
      isAcceptance: true,
      transition: NONE       // there is never a transition out of the 'complete' state
    },
  ],
  initialData: {
    p: 0,
    n: 0,
    d: 0,
    q: 0,
    amt: 68,
    change: 68
  }
};

describe('Finite State Machine', () => {

  it('properly constructs a new state machine', () => {
    const fsm: FiniteStateMachine<unknown> = new FiniteStateMachine<unknown>();

    expect(fsm.numStates).toBe(0);
    expect(fsm.numTransitions).toBe(0);
    expect(fsm.currentState).toBe(FiniteStateMachine.NO_STATE);
    expect(fsm.isAcceptance).toBe(false);
  });

  it('no data returns false when initializing FSM', () => {
    const tmp: any = null;

    const fsm: FiniteStateMachine<unknown> = new FiniteStateMachine<unknown>();
    const action: DecisionTreeAction       = fsm.fromJson(tmp);

    expect(action.success).toBe(false);
    expect(action.action).toBe(FiniteStateMachine.NO_DATA);
  });

  it('next method returns null for empty machine', () => {
    const fsm: FiniteStateMachine<object> = new FiniteStateMachine<object>();

    expect(fsm.next({})).toBe(null);
  });

  it('addState method results in correct state count', () => {
    const fsm: FiniteStateMachine<unknown> = new FiniteStateMachine<unknown>();

    fsm.addState('STATE1');
    expect(fsm.numStates).toBe(1);

    fsm.addState('STATE2');
    expect(fsm.numStates).toBe(2);

    fsm.addState('STATE3');
    expect(fsm.numStates).toBe(3);
  });

  it('can iterate over states', () => {
    const fsm: FiniteStateMachine<unknown> = new FiniteStateMachine<unknown>();
    fsm.addState('STATE1');
    fsm.addState('STATE2');
    fsm.addState('STATE3');

    const stateItr: IterableIterator<string> = fsm.states;

    expect(stateItr.next().value).toBe('STATE1');
    expect(stateItr.next().value).toBe('STATE2');
    expect(stateItr.next().value).toBe('STATE3');
  });

  it('clear and redundant state test', () => {
    const fsm: FiniteStateMachine<unknown> = new FiniteStateMachine<unknown>();
    fsm.addState('STATE1');
    fsm.addState('STATE2');
    fsm.addState('STATE3');

    fsm.clear();
    expect(fsm.numStates).toBe(0);

    fsm.addState('STATE1');
    fsm.addState('STATE1');
    fsm.addState('STATE1');

    expect(fsm.numStates).toBe(1);
  });

  it('addTransition returns false for non-existent states', () => {
    const fsm: FiniteStateMachine<string> = new FiniteStateMachine<string>();

    expect(fsm.addTransition('s1', (from: string) => {
      return {to: 's2'}
    })).toBe(false);

    fsm.addState('STATE1');
    fsm.addState('STATE2');
    expect(fsm.numStates).toBe(2);
  });

  it('addTransition results in correct transition count', () => {
    const fsm: FiniteStateMachine<string> = new FiniteStateMachine<string>();

    fsm.addState('STATE1');
    fsm.addState('STATE2');
    fsm.addState('STATE3');
    fsm.addState('STATE4');

    expect(fsm.numStates).toBe(4);

    expect(fsm.addTransition('STATE1', (from: string) => {
      return {to: 'STATE4'}
    })).toBe(true);
    expect(fsm.numTransitions).toBe(1);

    expect(fsm.addTransition('STATE4', (from: string) => {
      return {to: 'STATE2'}
    })).toBe(true);
    expect(fsm.numTransitions).toBe(2);

    expect(fsm.addTransition('STATE2', (from: string) => {
      return {to: 'STATE3'}
    })).toBe(true);
    expect(fsm.numTransitions).toBe(3);

    expect(fsm.addTransition('STATE3', (from: string) => {
      return {to: 'STATE1'}
    })).toBe(true);
    expect(fsm.numTransitions).toBe(4);
  });

  it('binary sequence contains even number of zeros', () => {
    // does a binary number contain an even number of zeros?
    const fsm: FiniteStateMachine<number> = new FiniteStateMachine<number>();

    fsm.addState('S1', true);  // this is the machine's singleton acceptance state
    fsm.addState('S2');

    expect(fsm.numStates).toBe(2);

    expect(fsm.addTransition('S1', f1)).toBe(true);
    expect(fsm.numTransitions).toBe(1);

    expect(fsm.addTransition('S2', f2)).toBe(true);
    expect(fsm.numTransitions).toBe(2);

    let binary: Array<number> = [1, 0];
    let n: number = binary.length;
    let i: number;

    let state: FSMStateOutput<number> | null = fsm.next(binary[0], 'S1');

    for (i = 1; i < n; ++i) {
      state = fsm.next(binary[i]);
    }

    expect(state?.to).toBe('S2');
    expect(fsm.isAcceptance).toBe(false);

    binary = [0, 1];
    state = fsm.next(binary[0], 'S1');

    for (i = 1; i < n; ++i) {
      state = fsm.next(binary[i]);
    }

    expect(state?.to).toBe('S2');
    expect(fsm.isAcceptance).toBe(false);

    binary = [0, 1, 0];
    n      = binary.length;
    state  = fsm.next(binary[0], 'S1');

    for (i = 1; i < n; ++i) {
      state = fsm.next(binary[i]);
    }

    expect(state?.to).toBe('S1');
    expect(fsm.isAcceptance).toBe(true);

    binary = [0, 1, 0, 1];
    n      = binary.length;
    state  = fsm.next(binary[0], 'S1');

    for (i = 1; i < n; ++i) {
      state = fsm.next(binary[i]);
    }

    expect(state?.to).toBe('S1');
    expect(fsm.isAcceptance).toBe(true);

    binary = [1, 0, 1, 1, 1, 0];
    n      = binary.length;
    state  = fsm.next(binary[0], 'S1');

    for (i = 1; i < n; ++i) {
      state = fsm.next(binary[i]);
    }

    expect(state?.to).toBe('S1');
    expect(fsm.isAcceptance).toBe(true);

    binary = [0, 0, 0];
    n      = binary.length;
    state  = fsm.next(binary[0], 'S1');

    for (i = 1; i < n; ++i) {
      state = fsm.next(binary[i]);
    }

    expect(state?.to).toBe('S2');
    expect(fsm.isAcceptance).toBe(false);

    binary = [0, 0, 0, 0];
    n      = binary.length;
    state  = fsm.next(binary[0], 'S1');

    for (i = 1; i < n; ++i) {
      state = fsm.next(binary[i]);
    }

    expect(state?.to).toBe('S1');
    expect(fsm.isAcceptance).toBe(true);
  });

  it('machine test #2', () => {
    // test generated strings
    const fsm: FiniteStateMachine<string> = new FiniteStateMachine<string>();

    fsm.addState('S1');
    fsm.addState('S2');
    fsm.addState('S3');
    fsm.addState('S4', true);

    expect(fsm.addTransition('S1', f12)).toBe(true);
    expect(fsm.addTransition('S2', f22)).toBe(true);
    expect(fsm.addTransition('S3', f32)).toBe(true);
    expect(fsm.addTransition('S4', f42)).toBe(true);
    expect(fsm.numTransitions).toBe(4);

    let str: Array<string> = ['a'];
    let n: number = str.length;
    let i: number;

    let state: FSMStateOutput<string> | null = fsm.next(str[0], 'S1');
    expect(state?.to).toBe('S2');

    str = ['a', 'b'];
    n   = str.length;

    for (i = 1; i < n; ++i) {
      state = fsm.next(str[i]);
    }

    expect(state?.to).toBe('S1');
    expect(fsm.isAcceptance).toBe(false);

    str = ['a', 'b', 'a', 'c'];
    n = str.length;

    state = fsm.next(str[0], 'S1');

    for (i = 1; i < n; ++i) {
      state = fsm.next(str[i]);
    }

    expect(fsm.isAcceptance).toBe(true);

    str = ['a', 'b', 'a', 'c', 'd', 'a', 'a', 'c'];
    n   = str.length;

    state = fsm.next(str[0], 'S1');
    for (i = 1; i < n; ++i) {
      state = fsm.next(str[i]);
    }

    expect(fsm.isAcceptance).toBe(true);

    str = ['a', 'a', 'a', 'a', 'a', 'c'];
    n   = str.length;

    state = fsm.next(str[0], 'S1');
    for (i = 1; i < n; ++i) {
      state = fsm.next(str[i]);
    }

    expect(fsm.isAcceptance).toBe(true);

    str = ['a', 'a', 'a', 'a', 'c', 'd'];
    n   = str.length;

    state = fsm.next(str[0], 'S1');
    for (i = 1; i < n; ++i) {
      state = fsm.next(str[i]);
    }

    expect(fsm.isAcceptance).toBe(false);
  });

  it('does binary sequence end in a 1?', () => {
    const fsm: FiniteStateMachine<number> = new FiniteStateMachine<number>();

    fsm.addState('S1');
    fsm.addState('S2', true);

    expect(fsm.numStates).toBe(2);

    expect(fsm.addTransition('S1', f13)).toBe(true);
    expect(fsm.numTransitions).toBe(1);

    expect(fsm.addTransition('S2', f23)).toBe(true);
    expect(fsm.numTransitions).toBe(2);

    let binary: Array<number> = [1, 0];
    let n: number = binary.length;
    let i: number;

    let state: FSMStateOutput<number> | null = fsm.next(binary[0], 'S1');

    for (i = 1; i < n; ++i) {
      state = fsm.next(binary[i]);
    }

    expect(state?.to).toBe('S1');
    expect(fsm.isAcceptance).toBe(false);

    binary = [1];
    n      = binary.length;
    state  = fsm.next(binary[0], 'S1');

    for (i = 1; i < n; ++i) {
      state = fsm.next(binary[i]);
    }

    expect(state?.to).toBe('S2');
    expect(fsm.isAcceptance).toBe(true);

    binary = [0];
    n      = binary.length;
    state  = fsm.next(binary[0], 'S1');

    for (i = 1; i < n; ++i) {
      state = fsm.next(binary[i]);
    }

    expect(state?.to).toBe('S1');
    expect(fsm.isAcceptance).toBe(false);

    binary = [0, 1, 0];
    n      = binary.length;
    state  = fsm.next(binary[0], 'S1');

    for (i = 1; i < n; ++i) {
      state = fsm.next(binary[i]);
    }

    expect(fsm.isAcceptance).toBe(false);

    binary = [0, 1, 0, 1];
    n      = binary.length;
    state  = fsm.next(binary[0], 'S1');

    for (i = 1; i < n; ++i) {
      state = fsm.next(binary[i]);
    }

    expect(fsm.isAcceptance).toBe(true);

    binary = [1, 0, 1, 1, 1, 1];
    n      = binary.length;
    state  = fsm.next(binary[0], 'S1');

    for (i = 1; i < n; ++i) {
      state = fsm.next(binary[i]);
    }

    expect(fsm.isAcceptance).toBe(true);
  });

  it('test transition handlers', () => {
    // elevator goes between floor zero and one
    const fsm: FiniteStateMachine<string> = new FiniteStateMachine<string>();

    // there are no acceptance states
    fsm.addState('GROUND');
    fsm.addState('FIRST');

    expect(fsm.numStates).toBe(2);

    expect(fsm.addTransition('GROUND', f14)).toBe(true);
    expect(fsm.numTransitions).toBe(1);

    expect(fsm.addTransition('FIRST', f24)).toBe(true);
    expect(fsm.numTransitions).toBe(2);

    let DIRECTION: string = ELEVATOR_NONE;
    const elevatorObserver: Observer<StateTransition<string>> = {
      next: (trans: StateTransition<string>) => {
        const leg: string = trans.from + trans.to;
        DIRECTION = leg === 'GROUNDFIRST' ? 'UP' : (leg === 'FIRSTGROUND' ? 'DOWN' : trans.from);
        console.log(`Elevator Direction: ${DIRECTION}`);
      },
      error: () => {console.log('error')},
      complete: () => {console.log('complete')}
    };

    fsm.addSubscriber(elevatorObserver);

    fsm.next('', 'GROUND');
    expect(DIRECTION).toBe('GROUND');

    fsm.next('UP');
    expect(DIRECTION).toBe('UP');

    fsm.next('UP');
    expect(DIRECTION).toBe('FIRST'); // remain on 1st floor

    fsm.next('DOWN');
    expect(DIRECTION).toBe('DOWN');

    fsm.next('DOWN');
    expect(DIRECTION).toBe('GROUND'); // remain on ground floor
  });

  it('change machine without observer', () => {
    // accept coins for amount less than one dollar and tally amount of each coin as well as change to be made, if any
    const fsm: FiniteStateMachine<Payment> = new FiniteStateMachine<Payment>();

    // add states
    fsm.addState(PENNIES);
    fsm.addState(NICKELS);
    fsm.addState(QUARTERS);
    fsm.addState(DIMES);
    fsm.addState(PAYMENT_COMPLETE, true);  // 'complete' is the acceptance state

    expect(fsm.numStates).toBe(5);

    // initial payment state; start with 15 cents
    const payment: Payment = {
      p: 0,
      n: 0,
      d: 0,
      q: 0,
      amt: 0.15,
    };

    // we can use one transition function for everything; note that we never transition from the completed state

    // yes, all your transitions are belong to us :)
    fsm.addTransition('p', payola);
    fsm.addTransition('n', payola);
    fsm.addTransition('d', payola);
    fsm.addTransition('q', payola);
    expect(fsm.numTransitions).toBe(4);

    // begin with a penny payment - the following would normally be executed in a while loop that terminated as soon
    // as the acceptance state was realized
    let state: FSMStateOutput<Payment> | null = fsm.next(payment, PENNIES);
    expect(state?.to).toBe(DIMES);
    let amount: number = state?.data?.amt as number;
    expect(Math.abs(amount - 0.14) < 0.001).toBe(true);

    // remaining sequence of payments
    state = fsm.next(payment);
    expect(state?.to).toBe(PENNIES);
    amount = state?.data?.amt as number;
    expect(Math.abs(amount - 0.04) < 0.001).toBe(true);

    state = fsm.next(payment);
    expect(state?.to).toBe(PENNIES);
    amount = state?.data?.amt as number;
    expect(Math.abs(amount - 0.03) < 0.001).toBe(true);

    state = fsm.next(payment);
    expect(state?.to).toBe(PENNIES);
    amount = state?.data?.amt as number;
    expect(Math.abs(amount - 0.02) < 0.001).toBe(true);

    state = fsm.next(payment);
    expect(state?.to).toBe(PENNIES);
    amount = state?.data?.amt as number;
    expect(Math.abs(amount - 0.01) < 0.001).toBe(true);

    state  = fsm.next(payment);
    amount = state?.data?.amt as number;
    expect(Math.abs(amount) < 0.01).toBe(true);
    expect(fsm.isAcceptance).toBe(true);
  });

  it('change machine test #2 without observer', () => {
    // accept coins for amount less than one dollar and tally amount of each coin as well as change to be made, if any
    const fsm: FiniteStateMachine<Payment> = new FiniteStateMachine<Payment>();

    // add states
    fsm.addState(PENNIES);
    fsm.addState(NICKELS);
    fsm.addState(QUARTERS);
    fsm.addState(DIMES);
    fsm.addState(PAYMENT_COMPLETE, true);  // 'complete' is the acceptance state

    expect(fsm.numStates).toBe(5);

    // initial payment state; start with 15 cents
    const payment: Payment = {
      p: 0,
      n: 0,
      d: 0,
      q: 0,
      amt: 0.23,
    };

    // we can use one transition function for everything; note that we never transition from the completed state

    // yes, all your transitions are belong to us :)
    fsm.addTransition('p', payola);
    fsm.addTransition('n', payola);
    fsm.addTransition('d', payola);
    fsm.addTransition('q', payola);
    expect(fsm.numTransitions).toBe(4);

    // try beginning with a quarter payout - this won't work, so it should transition to dimes with the original
    // amount as th remaining payment or leftover.
    let state: FSMStateOutput<Payment> | null = fsm.next(payment, QUARTERS);
    expect(state?.to).toBe(DIMES);
    let amount: number = state?.data?.amt as number;
    expect(Math.abs(amount - 0.23) < 0.001).toBe(true);

    // remaining sequence of payments
    state = fsm.next(payment);
    expect(state?.to).toBe(DIMES);
    amount = state?.data?.amt as number;
    expect(Math.abs(amount - 0.13) < 0.001).toBe(true);

    state = fsm.next(payment);
    expect(state?.to).toBe(PENNIES);
    amount = state?.data?.amt as number;
    expect(Math.abs(amount - 0.03) < 0.001).toBe(true);

    state = fsm.next(payment);
    expect(state?.to).toBe(PENNIES);
    amount = state?.data?.amt as number;
    expect(Math.abs(amount - 0.02) < 0.001).toBe(true);

    state = fsm.next(payment);
    expect(state?.to).toBe(PENNIES);
    amount = state?.data?.amt as number;
    expect(Math.abs(amount - 0.01) < 0.001).toBe(true);

    state  = fsm.next(payment);
    amount = state?.data?.amt as number;
    expect(Math.abs(amount) < 0.01).toBe(true);
    expect(fsm.isAcceptance).toBe(true);
  });

  it('change machine test with different trans fcn', () => {
      const fsm: FiniteStateMachine<Change> = new FiniteStateMachine<Change>();

      // add states
      fsm.addState(PENNIES);
      fsm.addState(NICKELS);
      fsm.addState(QUARTERS);
      fsm.addState(DIMES);
      fsm.addState(PAYMENT_COMPLETE, true);  // 'complete' is the acceptance state

      expect(fsm.numStates).toBe(5);

      // initial payment state; start with 15 cents
      const payment: Change = {
        p: 0,
        n: 0,
        d: 0,
        q: 0,
        amount: 15,
        change: 15
      };

      // we can use one transition function for everything; note that we never transition from the completed state

      // yes, all your transitions are belong to us :)
      fsm.addTransition('p', makeChange);
      fsm.addTransition('n', makeChange);
      fsm.addTransition('d', makeChange);
      fsm.addTransition('q', makeChange);
      expect(fsm.numTransitions).toBe(4);

      // always try the highest possible change amount first
      let state: FSMStateOutput<Change> | null = fsm.next(payment, QUARTERS);
      expect(state?.to).toEqual(DIMES);
      let amount: number = state?.data?.change as number;
      expect(amount).toEqual(15);

      // remaining sequence of payments
      state = fsm.next(payment, state?.to);
      expect(state?.to).toEqual(DIMES);
      amount = state?.data?.change as number;
      expect(amount).toEqual(5);

      state = fsm.next(payment, state?.to);
      expect(state?.to).toBe(NICKELS);
      amount = state?.data?.change as number;
      expect(amount).toEqual(5);

      state = fsm.next(payment, state?.to);
      expect(state?.to).toBe(COMPLETE);
      amount = state?.data?.change as number;
      expect(amount).toEqual(0);
    });

  it('change machine function test #1', () => {
    const fsm: FiniteStateMachine<Change> = changeMachineFactory();

    const change: Change = createChange(0.15);

    processChange(fsm, change);

    expect(change.n).toEqual(1);
    expect(change.d).toEqual(1);
  });

  it('change machine function test #2', () => {
    const fsm: FiniteStateMachine<Change> = changeMachineFactory();

    const change: Change = createChange(0.98);

    processChange(fsm, change);

    expect(change.q).toEqual(3);
    expect(change.d).toEqual(2);
    expect(change.n).toEqual(0);
    expect(change.p).toEqual(3);
  });

  it('data-defined machine test #1', () => {
    const fsm: FiniteStateMachine<string> = new FiniteStateMachine<string>();

    const result: DecisionTreeAction = fsm.fromJson(machine1);

    expect(result.success).toBe(true);
    expect(result.action).toBe(FiniteStateMachine.VALID);
    expect(fsm.initialState).toBe('S1');

    const alphabet: Array<string> = fsm.alphabet as Array<string>;
    expect(alphabet[0]).toBe('a');
    expect(alphabet[1]).toBe('b');
    expect(alphabet[2]).toBe('c');
    expect(alphabet[3]).toBe('d');

    // note that the original state is already set from the provided data
    let str: Array<string> = ['a', 'b', 'a', 'c', 'd', 'a', 'a', 'c'];
    let n: number          = str.length;
    let i: number;
    let state: FSMStateOutput<string> | null;

    for (i = 0; i < n; ++i) {
      state = fsm.next(str[i]);
    }

    expect(fsm.isAcceptance).toBe(true);

    str = ['a', 'a', 'a', 'a', 'c', 'd'];
    n   = str.length;

    for (i = 0; i < n; ++i) {
      state = fsm.next(str[i]);
    }

    expect(fsm.isAcceptance).toBe(false);
  });

  it('factory returns null machine from bad data', () => {
    const tmp: any = {};
    const machine: FiniteStateMachine<unknown> | null = FiniteStateMachine.create(tmp);

    expect(machine).toBe(null);
  });

  it('factory creates a machine correctly from Object data', () => {
    const fsm: FiniteStateMachine<Change> = FiniteStateMachine.create(TheChangeMachine) as FiniteStateMachine<Change>;

    expect(fsm).toBeTruthy();

    expect(fsm.initialData).toBeTruthy();

    const change: Change = fsm.initialData as Change;

    processChange(fsm, change);

    expect(change.p).toEqual(3);
    expect(change.n).toEqual(1);
    expect(change.d).toEqual(1);
    expect(change.q).toEqual(2);
  });
});
