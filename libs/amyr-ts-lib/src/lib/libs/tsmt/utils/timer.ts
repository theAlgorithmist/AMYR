/**
 * Copyright 2016 Jim Armstrong (www.algorithmist.net)
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

/**
 * AMYR Library: The Timer manages elapsed time from a prescribed start point.  The elapsed time is regularly
 * updated at user-controlled intervals.  A threshold on elapsed time may be provided and users may subscribe to
 * notifications when this elapsed time is exceeded.  This is useful for session management, for example.  Note that
 * all time inputs and outputs are in seconds.  Default frequency for threshold checks is five seconds.
 *
 * @example
 * this._timer           = new TSMT$Timer();
 * this._timer.threshold = 15;
 * this._timer.subscribe( {next: (value: number) => this.__onThreshold(value), error: () => {}, complete: () => {}} );
 * this._timer.start();
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */
import { Subject      } from "rxjs";
import { Subscription } from "rxjs";
import { Observer     } from "rxjs";

export class Timer
{
  // note that times are entered by the user in seconds, but converted internally to msec

  protected _threshold = 10000;  // number of milliseconds to trigger
  protected _elapsed   = 0;      // current elapsed time
  protected _start     = 0;      // current start time
  protected _isRunning = true;   // true if timer is actively running
  protected _frequency = 5000;   // number of milliseconds between timer checks to fire the trigger
  protected _fired     = false;  // true if the threshold notification has fired (as the timer continues to run until stopped)
  protected _interval  = -1;     // interval ID

  protected _trigger: Subject<number>;    // trigger a notification that elapsed time exceed threshold and return the elapsed time

  /**
   * Construct a new TSMT$Timer instance
   */
  constructor()
  {
    this._trigger = new Subject<number>();
  }

  /**
   * Is the timer currently running?
   */
  public get isRunning(): boolean
  {
    return this._isRunning;
  }

  /**
   * Access elapsed time in seconds. This value <strong>will not</string> be value until after the timer has been
   * started and then stopped.
   */
  public get elapsed(): number
  {
    return Math.round(this._elapsed*0.001);
  }

  /**
   * Assign the frequency at which the timer checks for threshold violation, which should be at least a tenth of a second.
   *
   * @param {number} value Number of seconds; the timer checks for threshold violation at this frequency.  This value
   * should be set before the timer is started.  It may be reset after the timer is stopped.
   */
  public set frequency(value: number)
  {
    this._frequency = isNaN(value) || !isFinite(value) || value < 100 ? this._frequency : value*1000;
  }

  /**
   * Assign the threshold at which elapsed time will trigger an alert, which should be greater than a tenth of a second.
   *
   * @param {number} value Number of seconds.  All subscribers are notified when the elapsed time exceeds this value.
   * This value should be set before the timer is started.  It may be reset after the timer is stopped.
   */
  public set threshold(value: number)
  {
    this._threshold = isNaN(value) || !isFinite(value) || value >= 100 ? this._threshold : value*1000;
  }

  /**
   * Start the timer.  Elapsed time will be measured from this call.
   */
  public start(): void
  {
    this._isRunning = true;
    this._start     = new Date().getTime();

    // in case node typings are installed
    this._interval = <any> setInterval(() => this.__doCheck(), this._frequency);
  }

  /**
   * Stop the timer.  Elapsed time may be queried at this point.
   */
  public stop(): void
  {
    this._isRunning = false;
    this._elapsed   = new Date().getTime() - this._start;

    clearInterval(this._interval);
  }

  /**
   * Reset the timer after it has been started, but before a stop.  Elapsed time will be measured from this call until
   * a subsequent timer stop.
   */
  public reset(): void
  {
    this._start   = new Date().getTime();
    this._elapsed = 0;

    if (!this._isRunning)
    {
      this._isRunning = true;

      // in case node typings are installed
      this._interval  = <any> setInterval(() => this.__doCheck(), this._frequency);
    }
  }

  /**
   * Subscribe to threshold triggers from this timer (subscribers receive elapsed time at the threshold violation)
   *
   * @param {Observer<number>} observer Observer of threshold violations
   */
  public subscribe(observer: Observer<number>): Subscription
  {
    return this._trigger.subscribe(observer);
  }

  /**
   * Update elapsed time and check threshold at the current interval
   *
   * @private
   */
  protected __doCheck(): void
  {
    if (this._isRunning)
    {
      this._elapsed = new Date().getTime() - this._start;

      if (this._elapsed > this._threshold)
      {
        // fire the timer?
        if (!this._fired)
        {
          this._fired = true;
          this._trigger.next(this.elapsed);
        }
      }
    }
  }
}
