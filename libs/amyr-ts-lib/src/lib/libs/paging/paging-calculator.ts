/**
 * Copyright 2017 Jim Armstrong (www.algorithmist.net)
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
 *
 * AMYR Library; A paging helper class for displaying only portions (pages) of a UI Component whose data
 * provider is an {Array} of {unknown} types. This class manages computations, so it is not a platform=specific pager.
 * Rather, it performs all the bookkeeping relative to the paging process.  It is ideal for applications where paging
 * computations are needed, but a full-featured, platform-specific component is overkill.<br/><br/>
 * Usage: set the data provider before paging, then set page size.  Query pages to obtain appropriate slices of the
 * data provider and bound to that return in a Component.  Shallow copies of the data provider are returned,
 * The alternative is to simply query the {from} and {to} indices the current page and manage references to the original
 * data provider in a means that is best-suited to a specific application.
 *
 * Programmed by:  Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * Version 1.0.0
 */

export class PagingCalculator
{
  protected _itemCount: number;       // total number of items in a data provider to be paged
  protected _fromIndex: number;       // current page extends from this (zero-based) index
  protected _toIndex: number;         // current page extends to this (zero-based) index
  protected _currentPage: number;     // current page number (zero is first page)
  protected _pageSize: number;        // page size or number items per page
  protected _pageCount: number;       // total number of pages

  // data provider - this is the array to be paged
  protected _dataProvider: Array<unknown>;

  constructor()
  {
    this._itemCount   = 0;
    this._fromIndex   = 0;
    this._toIndex     = 0;
    this._currentPage = 0;
    this._pageSize    = 0;
    this._pageCount   = 0;

    this._dataProvider = [];
  }

  /**
   * Access the total number of items to be paged
   */
  public get itemCount(): number
  {
    return this._dataProvider.length;
  }

  /**
   * Access the current (zero-based) page number
   */
  public get currentPage(): number
  {
    return this._currentPage;
  }

  /**
   * Access the 'from' item index for the current page
   */
  public get from(): number
  {
    return this._fromIndex;
  }

  /**
   * Access the 'to' item index for the current page
   */
  public get to(): number
  {
    return this._toIndex;
  }

  /**
   * Access the total number of complete and partial pages based on current settings
   */
  public get pageCount(): number
  {
    return this._pageCount;
  }

  /**
   * Access the remaining number of items on any partial page.   For example, page count is 3 and total number
   * of items is 5.  This method returns 2.  If the page size evenly divides the item count, this method returns zero
   */
  public get remainder(): number
  {
    if (this._itemCount > 0 && this._pageSize > 0)
      return this._itemCount % this._pageSize;
    else
      return 0;
  }

  /**
   * Assign a data provider to be paged.  This sets the internal item count and maintains a direct reference to the
   * data provider.  Note that it is possible to temporarily set the data provider to something with a length less than
   * the current page count, however, the page count should be updated before any paging operations.  Resetting the
   * data provider also resets the current page index and from/to indices.
   *
   * @param data: Array<unknown> Reference to data provider
   */
  public set dataProvider(data: Array<unknown>)
  {
    if (data !== undefined && data != null && data.length)
    {
      // store a direct reference in case the data mutates during paging process
      this._dataProvider = data;
      this._itemCount    = this._dataProvider.length;

      this.__setPageData();
    }
  }

  /**
   * Assign the page size, provided the input is defined and less than or equal to the number of items in the data
   * provider.
   *
   * @param size Integer page size (should be at least 1)
   */
  public set pageSize(size: number)
  {
    if (!isNaN(size) && isFinite(size) && size <= this._dataProvider.length)
    {
      size           = Math.round(Math.abs(size));
      this._pageSize = Math.max(1, size);

      this.__setPageData();
    }
  }

  /**
   * Generate the first page in sequence, which is a shallow copy of the portion of the data provider that represents
   * the first page. The return {Array} is empty if a provider has not been set.
   */
  public get first(): Array<unknown>
  {
    return this.__isValid() ? this._dataProvider.slice(0, this._pageSize) : [];
  }

  /**
   * Generate the last page in sequence, which is a shallow copy of the portion of the data provider that represents
   * the last page. The return {Array} is empty if a provider has not been set.
   */
  public get last(): Array<unknown>
  {
    const from: number = this._itemCount - this._pageSize;

    return this.__isValid() ? this._dataProvider.slice(from, this._itemCount) : [];
  }

  /**
   * Generate the next page in sequence, which is a shallow copy of the portion of the data provider that represents
   * the next page in sequence.  This also updates the current page index and from/to indices.  It is not possible to
   * advance paging beyond the last page in sequence.  Any attempt to do so causes the final page to be returned.
   */
  public next(): Array<unknown>
  {
    if (this._currentPage+1 < this._pageCount) {
      this._currentPage++;

      this._fromIndex += this._pageSize;
      this._toIndex   += this._pageSize;
    }

    return this.__isValid() ? this._dataProvider.slice(this._fromIndex, this._toIndex+1) : [];
  }

  /**
   * Generate the previous page in sequence, which is a copy of the portion of the data provider that represents the
   * previous page in sequence; this also updates the current page index and from/to indices.  It is not possible to
   * advance paging beyond the first page in sequence.  Any attempt to do so causes the first page to be returned.
   */
  public previous(): Array<unknown>
  {
    if (this._currentPage-1 >= 0)
    {
      this._currentPage--;

      this._fromIndex -= this._pageSize;
      this._toIndex   -= this._pageSize;
    }

    return this.__isValid() ? this._dataProvider.slice(this._fromIndex, this._toIndex+1) : [];
  }

  /**
   * Set a specified page index and recompute the from/to indices
   *
   * @param page: number Zero-based page index
   */
  public setPage(page: number): void
  {
    const from: number = page*this._pageSize;
    const to: number   = Math.min(from+this._pageSize-1, this._itemCount-1);

    if (from >= this._itemCount) return;

    this._fromIndex   = from;
    this._toIndex     = to;
    this._currentPage = page;
  }

  /**
   * Fetch a specified page, which is a shallow copy of the portion of data provider corresponding to the specified page.
   * This call returns an empty array if the page index is invalid or a data provider/page size has not been set.
   * This call also alters the current page and to/from index settings.
   *
   * @param page: number Zero-based page index
   */
  public getPage(page: number): Array<unknown>
  {
    if (this.__isValid() && page >= 0 && page < this._pageCount)
    {
      const from: number = page*this._pageSize;
      const to: number   = Math.min(from+this._pageSize-1, this._itemCount-1);

      if (from >= this._itemCount) return [];

      this._fromIndex   = from;
      this._toIndex     = to;
      this._currentPage = page;

      return this._dataProvider.slice(this._fromIndex, this._toIndex+1);
    }
    else
      return [];
  }

  protected __isValid(): boolean
  {
    return this._dataProvider !== undefined && this._dataProvider != null && this._itemCount > 0 && this._pageSize > 0
           && this._pageSize <= this._itemCount;
  }

  protected __setPageData(): void
  {
    if (this._itemCount > 0 && this._pageSize > 0)
    {
      this._pageCount = Math.floor(this._itemCount/this._pageSize);

      if (this._pageCount*this._pageSize < this._itemCount) {
        this._pageCount++;
      }

      this._fromIndex   = 0;
      this._toIndex     = this._pageSize-1;
      this._currentPage = 0;
    }
  }
}
