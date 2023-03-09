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
 * Typescript Math Toolkit: Minimal implementation of a FIFO queue of generic items.
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */

 export class TSMT$Queue<T>
 {
   protected _queue: Array<T>;                // The actual queue

 /**
  * Construct a new queue of the supplied type
  */
  constructor( )
  {
    this._queue  = new Array<T>();
  }

  /**
	 * Access the length or size of the queue
	 */
	 public get length(): number
	 {
	   return this._queue.length;
   }

  /**
   * Initialize the queue from an existing array
   *
   * @param {Array<T>} items Array of queue items
   */
   public fromArray(items: Array<T>): void
   {
     if (items != null && items.length && items.length > 0) this._queue = items.slice();
   }

  /**
   * Return the current queue as an an array
   */
   public toArray(): Array<T>
   {
     return this._queue.slice();
   }

  /**
   * Add an item to the queue
   *
   * @param {T} item Data item of type T
   */
   public enqueue(item: T): void
   {
     if (item !== undefined && item != null) this._queue.push(item);
   }

  /**
   * Remove item from the queue.  Returns a direct reference to the next queue item  or null for an empty queue.
   * The item is permanently removed from the queue.
   */
   public dequeue(): T | null
   {
     if (this._queue.length == 0) return null;

     return this._queue.shift() as T;
   }

  /**
	 * Clear the queue
	 */
	 public clear(): void
	 {
	   this._queue.length = 0;
   }
 }
