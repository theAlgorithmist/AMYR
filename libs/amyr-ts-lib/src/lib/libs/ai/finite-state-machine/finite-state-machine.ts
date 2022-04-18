/**
 * Copyright 2018 Jim Armstrong (www.algorithmist.net)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  Subject,
  Observer,
  Subscription
} from 'rxjs';

import { DecisionTreeAction } from "../../../models/decision-tree-action";

import {
  FSMState,
  StateMachineDefinition,
  StateTransition,
  FSMStateOutput,
  transFunction
} from "../../../models/state-machine-models";

/**
 * AMYR Reactive, data-driven Finite State Machine.  A state transition must have a 'from' and 'to' (named) state and
 * may contain optional {object} data.  A Mealy Finite State Machine that is designed to be driven by {object} data that
 * itself is likely metadata in a larger collection.  While the architecture is Mealy, Moore-style machines may also be
 * used.  It is possible to exercise class methods directly, although typical use is to create a machine directly from
 * the static factory ({create}) or construct machine and then later initialize it through the {fromJson} method.
 * <br/>
 * <br/>
 * While transition functions may be defined in Object data, they should be pure and small.  Pay particular attention
 * to scope and do not use the self-referential pointer (this) inside any such function.  Refer to the specs in the
 * test folder that accompanies this distribution for detailed usage examples.
 * <br/>
 * <br/>
 * The machine is initialized in the {NO_STATE} state by default.  If no initial state is defined in data, it is
 * customary to indicate the initial state by using the optional argument in the {next()} function.
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */
export class FiniteStateMachine<T>
{
  public static NO_STATE      = '[FSM] NO_STATE';
  public static NO_DATA       = '[FSM] NO_DATA';
  public static VALID         = '[FSM] DATA_VALID';
  public static MISSING_PROPS = '[FSM] MISSING_PROPS';
  public static INVALID_DATA  = '[FSM] INVALID_DATA';

  public name: string;                                        // an optional name given to this FSM
  protected _curState: string;                                // name of the current state

  protected _states: Set<string>;                             // collection of state names
  protected _transitions: Record<string, transFunction<T>>;   // collection of state transition functions

  protected _subject: Subject<StateTransition<T>>;
  protected _subscriptions: Array<Subscription>;

  // optional hash of acceptance states; there are entire classes of machines for which this concept is not
  // relevant, so this structure is created JIT
  protected _acceptanceStates: Record<string, boolean> | null;

  // TODO - add rejection states

  // these are relevant to machines defined with external Object data
  protected _initialState: string;
  protected _initialData: object | null;
  protected _alphabet: Array<string> | null;

  constructor()
  {
    this.name              = '';
    this._curState         = FiniteStateMachine.NO_STATE;
    this._states           = new Set<string>();
    this._transitions      = {};
    this._subject          = new Subject<StateTransition<T>>();
    this._subscriptions    = new Array<Subscription>();

    this._initialState     = FiniteStateMachine.NO_STATE;
    this._initialData      = null;
    this._alphabet         = null;
    this._acceptanceStates = null;
  }

  /**
   * Create a new FSM or return {null} in the case of invalid input data
   *
   * @param {StateMachineDefinition} data External (data) representation of this machine
   *
   * @param {string} name Finite State Machine name
   */
  public static create<T>(data: StateMachineDefinition, name?: string): FiniteStateMachine<T> | null
  {
    if (data !== undefined && data != null)
    {
      const machine: FiniteStateMachine<T> = new FiniteStateMachine<T>();
      const result: DecisionTreeAction     = machine.fromJson(data);

      if (result.success)
      {
        machine.name = name !== undefined ? name : '';
        return machine;
      }
    }

    return null;
  }

  /**
   * Access the number of states defined for this machine
   */
  public get numStates(): number
  {
    return this._states.size;
  }

  /**
   * Access the number of state transitions defined for this machine
   */
  public get numTransitions(): number
  {
    return Object.keys(this._transitions).length;
  }

  /**
   * Access the current state of this machine
   */
  public get currentState(): string
  {
    return this._curState;
  }

  /**
   * Access the named states in this machine in the order they were defined
   */
  public get states(): IterableIterator<string>
  {
    return this._states.keys();
  }

  /**
   * Access the initial state of this machine
   *
   * @returns {string} This is ONLY relevant for a machine defined by {Object} data
   */
  public get initialState(): string
  {
    return this._initialState;
  }

  /**
   * Access initial data associated with the definition of this machine
   */
  public get initialData(): object | null
  {
    return this._initialData ? JSON.parse(JSON.stringify(this._initialData)) : null;
  }

  /**
   * Access if this machine is currently in an acceptance state
   */
  public get isAcceptance(): boolean
  {
    return this._acceptanceStates !== undefined && this._acceptanceStates != null
      ? (this._acceptanceStates as Record<string,boolean>)[this._curState] !== undefined
        ? (this._acceptanceStates as Record<string,boolean>)[this._curState]
        : false
      : false;
  }

  /**
   * Access the alphabet defined for this machine, provided the machine was defined with external data
   */
  public get alphabet(): Array<string> | null
  {
    return this._alphabet == null ? null : this._alphabet.slice();
  }

  /**
   * Initialize this machine from external data.  The {DecisionTreeAction success} property is {true} and the
   * {action} property will be 'VALID' on proper initialization.
   *
   * @param {StateMachineDefinition} data Data definition of this machine (must include {name}, {alphabet}, and {states} properties
   */
  public fromJson(data: StateMachineDefinition): DecisionTreeAction
  {
    if (data === undefined || data == null)
    {
      return {
        success: false,
        action: FiniteStateMachine.NO_DATA
      }
    }

    // test required states
    if (data.name === undefined || data.alphabet === undefined || data.states === undefined)
    {
      return {
        success: false,
        action: FiniteStateMachine.MISSING_PROPS
      }
    }

    if (Object.prototype.toString.call(data.alphabet) === '[object Array]')
    {
      // good to go
      this._alphabet = data.alphabet.slice();
    }
    else
    {
      return {
        success: false,
        action: FiniteStateMachine.INVALID_DATA
      }
    }

    if (Object.prototype.toString.call(data.states) === '[object Array]')
    {
      if (data.states.length === 0)
      {
        return {
          success: false,
          action: FiniteStateMachine.NO_STATE
        }
      }
    }
    else
    {
      return {
        success: false,
        action: FiniteStateMachine.INVALID_DATA
      }
    }

    this.name          = data.name;
    this._initialState = data.initialState !== undefined ? data.initialState : FiniteStateMachine.NO_STATE;
    this._curState     = this._initialState;

    // process the states
    const n: number = data.states.length;
    let i: number;
    let state: FSMState;

    for (i = 0; i < n; ++i)
    {
      state = data.states[i];

      // TODO - work over error handling and apply transition function variable-check
      if (state.name !== undefined && state.isAcceptance !== undefined && state.transition !== undefined)
      {
        const fcn: transFunction<T> = new Function('data', 'state', state.transition) as transFunction<T>;

        this.addState(state.name, state.isAcceptance);
        this.addTransition(state.name, fcn);

        const sum = new Function('a', 'b', 'return a + b');
      }
      else
      {
        return {
          success: false,
          action: FiniteStateMachine.INVALID_DATA,
          node: state
        }
      }
    }

    // any initial data provided?
    if (data.initialData !== undefined)
    {
      if (data.initialData !== undefined && Object.prototype.toString.call(data.initialData) === '[object Object]')
      {
        this._initialData = JSON.parse(JSON.stringify(data.initialData));
      }
      else
      {
        return {
          success: false,
          action: FiniteStateMachine.INVALID_DATA,
          node: data.initialData
        }
      }
    }

    return {
      success: true,
      action: FiniteStateMachine.VALID
    };
  }

  /**
   * Add a named state to this machine
   *
   * @param {string} stateName State name
   *
   * @param {boolean} acceptance True if this is an acceptance state for the machine
   */
  public addState(stateName: string, acceptance: boolean=false): void
  {
    if (stateName !== undefined && stateName != '')
    {
      this._states.add(stateName);

      if (acceptance)
      {
        this._acceptanceStates            = this._acceptanceStates || {};
        this._acceptanceStates[stateName] = true;
      }
    }
  }

  /**
   * Add a transition from a named state to this machine and return {true} if the addition was successful
   *
   * @param {string} from Name of the 'from' state
   *
   * @param {transFunction} to Function that computes the next transition state and any associated data
   */
  public addTransition(from: string, to: transFunction<T>): boolean
  {
    // does the from state exist?
    const hasFrom: boolean = this._states.has(from);

    if (!hasFrom)  return false;

    // has a transition already been defined?
    if (this._transitions[from] !== undefined) return false;

    // add the transition
    this._transitions[from] = to;
    return true;
  }

  /**
   * Add a subscriber to observe state transitions
   *
   * @param {Observer<IStateTransition>} observer
   */
  public addSubscriber(observer: Observer <StateTransition<T>>): void
  {
    if (observer !== undefined && observer != null) {
      this._subscriptions.push( this._subject.subscribe(observer) );
    }
  }

  /**
   * Transition to the next state based on current state and input data
   *
   * @param input Input data or may be a prior state name for a Moore-style machine
   *
   * @param {string} initialState The initial state to use for the machine
   */
  public next(input: T, initialState?: string): FSMStateOutput<T> | null
  {
    if (initialState !== undefined && initialState != '') {
      this._curState = initialState;
    }

    const transFcn: transFunction<T> = this._transitions[this._curState];
    if (transFcn !== undefined)
    {
      const toState: FSMStateOutput<T> = transFcn(input, this._curState);

      // transition to that state and notify observers
      this._subject.next( {
        from: this._curState,
        to: toState.to,
        data: toState.data ? toState.data : input
      });

      this._curState = toState.to;

      return {
        to: this._curState,
        data: toState.data ? toState.data : input
      }
    }

    return null;
  }

  /**
   * Clear this machine and prepare for new data The only machine parameter that remains unaltered is the name.  The
   * machine is set to the {NO_STATE} state.
   */
  public clear(): void
  {
    this._states.clear();
    this._transitions = {};

    this._subscriptions.forEach( (sub: Subscription) => {sub.unsubscribe()} );

    this._subscriptions.length = 0;
    this._subject              = new Subject<StateTransition<T>>();
    this._curState             = FiniteStateMachine.NO_STATE;

    this._acceptanceStates = null;
    this._initialState     = FiniteStateMachine.NO_STATE;
    this._initialData      = null;
    this._alphabet         = null;
  }
}
