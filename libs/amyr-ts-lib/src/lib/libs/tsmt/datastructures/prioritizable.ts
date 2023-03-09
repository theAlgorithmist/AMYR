/**
 * Copyright 2016 Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
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
 * Typescript Math Toolkit: Prioritizable item
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */
import {IPrioritizable} from './iprioritizable';

export class Prioritizable<T> implements IPrioritizable<T>
{
  protected _priority: number;
  protected _timestamp: number;

  protected _data: T | null;

  constructor( TConstructor?: { new (): T } )
  {
    this._priority  = 0;
    this._timestamp = 0;

    this._data = null;

    if (TConstructor) this._data = new TConstructor();
  }

  public get priority(): number
  {
    return this._priority;
  }

  public set priority(value: number)
  {
    if (!isNaN(value) && value === value && value >= 0) this._priority = value;
  }

  public get timestamp(): number
  {
    return this._timestamp;
  }

  public set timestamp(value: number)
  {
    if (!isNaN(value) && value === value && value >= 0) this._timestamp = value;
  }

  public get data(): T | null
  {
    return this._data;
  }

  public set data(value: T | null)
  {
    if (value !== undefined && value != null) this._data = value;
  }
}
