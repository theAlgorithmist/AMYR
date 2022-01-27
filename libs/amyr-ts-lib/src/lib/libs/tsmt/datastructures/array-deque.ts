/**
 * Typescript Math Toolkit - (minimal) Typescript implementation of the Java ArrayDeque (helpful for
 * porting Java applications to TS).
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */

/**
 * Expose ArrayDeque methods implemented from the Java Array Deque
 */
export interface JavaArrayDeque<T>
{
  add(value: T | null): void;

  addFirst(value: T | null): void;

  addLast(value: T | null): void;

  isEmpty(): boolean;

  clear(): void;

  peek(): T | null;

  peekFirst(): T | null;

  peekLast(): T | null;

  removeFirst(): T | null;

  removeLast(): T | null;

  size(): number;
}

export class TSMT$ArrayDeque<T> implements JavaArrayDeque<T>
{
  protected _array: Array<T>;    // Array containing the elements

  constructor()
  {
    this._array = new Array<T>();
  }

  public add(value: T | null): void
  {
    if (value !== undefined && value != null) {
      this._array.push(value);
    }
  }

  public addFirst(value: T | null): void
  {
    if (value !== undefined && value != null) {
      this._array.unshift(value);
    }
  }

  public addLast(value: T | null): void
  {
    if (value !== undefined && value != null) {
      this._array.push(value);
    }
  }

  public isEmpty(): boolean
  {
    return this._array.length == 0;
  }

  public clear(): void
  {
    this._array.length = 0;
  }

  public peek(): T | null
  {
    return this._array.length == 0 ? null : this._array[0];
  }

  public peekFirst(): T | null
  {
    return this._array.length == 0 ? null : this._array[0];
  }

  public peekLast(): T | null
  {
    return this._array.length == 0 ? null : this._array[this._array.length-1];
  }

  public removeFirst(): T | null
  {
    return this._array.length == 0 ? null : this._array.shift() as T;
  }

  public removeLast(): T | null
  {
    return this._array.length == 0 ? null : this._array.pop() as T;
  }

  public size(): number
  {
    return this._array.length;
  }
}
