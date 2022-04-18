/**
 * The current state of a machine with a given name
 */
export interface FSMState
{
  name: string;

  isAcceptance: boolean;

  transition: string;
}

/**
 * Define a state machine
 */
export interface StateMachineDefinition
{
  name: string;

  initialState?: string;

  alphabet: Array<string>;

  states: Array<FSMState>;

  initialData?: object;
}

/**
 * A State transition consists of a 'from' state, a 'to' state, and optional data of a specified type
 */
export interface StateTransition<T>
{
  from: string;

  to: string;

  data?: T;
}

/**
 * Output from a state transition is the 'to' state and optional data obtained from the transition function
 */
export interface FSMStateOutput<T>
{
  to: string;

  data?: T;
}

/**
 * The transition function is Mealy-style, that is a transition to a new state is based on prior state and
 * input data.  Since state is optional in this interface, pass the state name as data and a Moore-style
 * machine can be implemented.
 */
export interface transFunction<T>
{
  (data: T, state?: string): FSMStateOutput<T>;
}
