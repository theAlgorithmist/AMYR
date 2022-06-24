/**
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
 * AMYR Library:  A frequency table that is suitable for use with naive Bayesian analysis or other applications
 * where it is necessary to tabulate frequency of occurrences.  Cell data must be numeric (integer).  The validate method
 * may help compensate for some table issues.  Laplace estimatio may also be added as separate method in a future release.
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */
import { DataStats } from '../data-stats'

export class FrequencyTable
{
  protected __stats: DataStats;

  protected _table: Array< Array<number> >;    // data table (stored column-major)
  protected _rowLabels: Array<string>;         // row labels
  protected _colLabels: Array<string>;         // column labels
  protected _rowTotals: Array<number>;         // row counts
  protected _colTotals: Array<number>;         // column counts

  protected _classSum: number;                 // accumulate class sum

  protected _sumInvalidated: boolean;          // true if class sum invalidated
  protected _invalidated: boolean;             // true if data invalidated

  constructor()
  {
    this.__stats  = new DataStats();

    this._table     = new Array< Array<number> >();
    this._rowLabels = new Array<string>();
    this._colLabels = new Array<string>();
    this._rowTotals = new Array<number>();
    this._colTotals = new Array<number>();

    this._classSum = 0.0;

    this._sumInvalidated = false;
    this._invalidated    = false;
  }

  /**
   * Clone the current frequency table
   */
  public clone(): FrequencyTable
  {
    const table: FrequencyTable = new FrequencyTable();

    // the internal table is transposed from what is expected via fromArray, so we have to do this by cell
    table.setupTable( this._rowLabels, this._colLabels);

    const rows: number = table.rowCount;
    const cols: number = table.colCount;

    let i: number;
    let j: number;
    let col: Array<number>;

    for (j = 0; j < cols; ++j)
    {
      col = this._table[j];

      // for each row
      for (i = 0; i < rows; ++i) {
        table.setCellFrequency(i, j, col[i]);
      }
    }

    for (i = 0; i < this._rowTotals.length; ++i) {
      table.addRowCount(this._rowLabels[i], this._rowTotals[i]);
    }

    return table;
  }

  /** @internal */
  public setCellFrequency(row: number, col: number, value: number): void
  {
    // back-door to manually assign cell frequencies by index; provided for performance reasons (no error-checking for
    // that reason
    const column: Array<number> = this._table[col];
    column[row]                 = value;

    this._invalidated    = true;
    this._sumInvalidated = true;
  }

  /**
   * Define a basic table that is empty and ready for dynamic input.  The row and column labels are assigned and the
   * table is initialized to zero counts. Use the {addCellCount} method to add cell counts to a cell (and adjust the
   * row totals)
   *
   * @param {Array<string>} rowLabels List of row labels or classes (the row count is inferred from the length of this array)
   *
   * @param {Array<string>} colLabels List of column labels (the column count is inferred from the length of this array)
   */
  public setupTable(rowLabels: Array<string>, colLabels: Array<string>): void
  {
    if (rowLabels === undefined || colLabels === undefined) return;

    this.__clear();

    this._rowLabels = rowLabels.slice();
    this._colLabels = colLabels.slice();

    const rows: number = this._rowLabels.length;
    const cols: number = this._colLabels.length;

    let i: number;
    let j: number;
    let col: Array<number>;

    for (j = 0; j < cols; ++j)
    {
      col = new Array<number>(rows);
      i   = rows;

      while (--i >= 0)
      {
        col[i] = 0;

        this._rowTotals[i] = 0;
      }

      this._table[j] = col;
    }

    this._invalidated = true;
  }

  /**
   * Assign the table from an array of arrays where each array represents a single row of data
   *
   * @param {Array<Array<number>>} data Each element is an array containing one row of data
   *
   * @param {Array<string>} rowLabels Character labels for each row (class)
   *
   * @param {Array<string>} colLabels Character labels for each column
   *
   * @param {Array<number>} rowTotals Array of integer row counts indicating the total number of samples for each
   * row or category, i.e. number of spam vs. non-spam messages.
   */
  public fromArray( data: Array< Array<number> >,
                    rowLabels: Array<string>,
                    colLabels: Array<string>,
                    rowTotals: Array<number> ): void
  {
    if (!data || !rowLabels || !colLabels || !rowTotals) return;

    if (rowLabels.length != rowTotals.length) return;

    this.__clear();
    const rows: number = rowLabels.length;

    this._rowLabels = rowLabels.slice();
    this._colLabels = colLabels.slice();
    this._rowTotals = rowTotals.slice();
    const n: number   = this._colLabels.length;

    let i: number;
    let j: number;

    // init
    for (j = 0; j < n; ++j) {
      this._table[j] = new Array<number>();
    }

    // consistency check
    for (i = 0; i < rows; ++i) {
      if (data[i].length != n) return;
    }

    // copy the data in, column-major
    let row: Array<number>;

    for (i = 0; i < rows; ++i)
    {
      row = data[i].slice();

      for (j = 0; j < n; ++j) {
        this._table[j].push(row[j]);
      }
    }

    this.__columnTotals();
  }

  /**
   * Access the column labels
   */
  public get columnLabels(): Array<string>
  {
    return this._colLabels.slice();
  }

  /**
   * Access the row labels
   */
  public get rowLabels(): Array<string>
  {
    return this._rowLabels.slice();
  }

  /**
   * Access the number of rows or data items per column
   */
  public get rowCount(): number
  {
    if (this._table.length === 0) return 0;

    return this._table[0].length;
  }

  /**
   * Access the number of columns
   */
  public get colCount(): number
  {
    if (this._table.length === 0) return 0;

    return this._table.length;
  }

  /**
   * Access the row counts
   */
  public get rowTotals(): Array<number>
  {
    return this._rowTotals.slice();
  }

  /**
   * Access the column counts
   */
  public get columnTotals(): Array<number>
  {
    if( this._invalidated ) this.__columnTotals();

    return this._colTotals.slice();
  }

  /**
   * Access the cumulative frequency of the all classes (sum of all row totals)
   */
  public get classSum(): number
  {
    if (this._sumInvalidated)
    {
      let sum = 0.0;
      let i: number;
      const row: number = this._rowTotals.length;

      for (i = 0; i < row; ++i) {
        sum += this._rowTotals[i];
      }

      this._classSum = sum;

      this._sumInvalidated = false;
    }

    return this._classSum;
  }

  /**
   * Access the raw table data.  Returns a copy of the internal table (stored column-major).  This is useful for
   * visualizing cell frequencies as a whole after a series of single-cell updates.
   */
  public get table(): Array< Array<number> >
  {
    const n: number = this._table.length;
    if (n === 0) return [];

    // preserve immutability of internal table data
    let i: number;
    const copy: Array< Array<number> > = new Array< Array<number> >();

    for ( i = 0; i < n; ++i) {
      copy.push( this._table[i].slice() );
    }

    return copy;
  }

  /**
   * Access a copy of a single column of data
   *
   * @param {string} label Column label
   */
  public getColumn(label:string): Array<number>
  {
    const index: number = this._colLabels.indexOf(label);
    if (index === -1) return new Array<number>();

    return this._table[index].slice();
  }

  /**
   * Access class probability; there is no error-checking on this method for performance reasons
   *
   * @param {className} string Class name or row label
   */
  public getClassProb(className: string): number
  {
    const row: number = this._rowLabels.indexOf(className);

    return this._rowTotals[row]/this.classSum;
  }

  /**
   * Access the prior probability of a given predictor (column) given the colum name.  There is no error-checking on
   * this method since it may be called frequently inside a loop
   *
   * @param {string} predictor Column (predictor) label
   */
  public getPrior(predictor: string): number
  {
    if( this._invalidated ) this.__columnTotals();

    const col:number = this._colLabels.indexOf(predictor);

    if (col === -1) return 0;

    return this._colTotals[col]/this.classSum;
  }

  /**
   * Access the conditional probability of a class given a predictor.  There is little error-checking on
   * this method since it is often called frequently inside a loop.
   *
   * @param {string} className Class name or row label
   *
   * @param {string} predictor - Predictor name or column label
   */
  public getConditional(predictor: string, className: string): number
  {
    const col: number = this._colLabels.indexOf(predictor);
    const row: number = this._rowLabels.indexOf(className);

    if (row === -1 || col === -1) return 0;

    const column: Array<number> = this._table[col];

    return column[row]/this._rowTotals[row];
  }

  /**
   * Remove a column from the current frequency table and shift other columns left
   *
   * @param {string} category Column name or category label
   */
  public removeColumn(category: string): void
  {
    const index: number = this._colLabels.indexOf(category);
    if( index === -1 ) return;

    this._table.splice(index, 1);
  }

  /**
   * Add to the count in a specified cell.  The cell frequency is updated provided that the row and column names are
   * accurate; negative frequencies are currently converted to positive
   *
   * @param {string} rowLabel Cell row label
   *
   * @param {string} colLabel Cell column label
   *
   * @param {number} count Optional (positive) integer count to add to the frequency of the cell - this also updates the
   * row count.
   * @default 1
   */
  public addCellFrequency(rowLabel: string, colLabel: string, count: number=1): void
  {
    count = Math.abs( Math.round(count) );

    const row: number = this._rowLabels.indexOf(rowLabel);
    const col: number = this._colLabels.indexOf(colLabel);

    const column: Array<number> = this._table[col];
    column[row]                += count;

    this._invalidated    = true;
    this._sumInvalidated = true;
  }

  /**
   * Add to the row totals for an interactive experiment, i.e. where cell frequencies are updated dynamically
   *
   * @param {string} rowLabel Row or class label to which the frequency is added
   *
   * @param {number} count Optional (positive) integer count to add to the frequency of the cell - this also updates the
   * row count.
   * @default 1
   */
  public addRowCount(rowLabel: string, count: number=1): void
  {
    count = Math.abs( Math.round(count) );

    const row: number = this._rowLabels.indexOf(rowLabel);

    this._rowTotals[row] += count;
  }

  /**
   * Validate the frequency table data.  Returns {true} if data is valid, as entered.  False if data is invalid,
   * although the following issues may be fixed via compensation.  Any instance of a non-numeric cell or infinite
   * count is set to a frequency of 0.  If any cell value in a row exceeds the row count, it is clipped to the row
   * count value.  This compensation is experimental and subject to refactoring/removal in a future release.
   *
   * @param {boolean} round  True if all cell data is rounded to nearest integer
   * @default false
   */
  public validate(round: boolean=false): boolean
  {
    if( this._table.length     == 0 ||
      this._rowLabels.length == 0 ||
      this._colLabels.length == 0 ||
      this._rowTotals.length == 0 ) {
      return false;
    }

    const rows: number = this._rowLabels.length;
    const n: number    = this._colLabels.length;

    // single-column table is invalid
    if (n === 1) return false;

    let i: number;
    let j: number;
    let item: number;

    for (i = 0; i < rows; ++i)
    {
      item = this._rowTotals[i];
      if (isNaN(item) || !isFinite(item)) return false;

      if (item < 1) return false;
    }

    let col: Array<number>;
    let status = true;

    for (j = 0; j < n; ++j)
    {
      col = this._table[j];

      for (i = 0; i < rows; ++i)
      {
        if (isNaN(col[i]) || !isFinite(col[i]) || col[i] < 0)
        {
          status = false;
          col[i] = 0;
        }
        else if (col[i] > this._rowTotals[i])
        {
          status = false;
          col[i] = this._rowTotals[i];
        }

        if (round) {
          col[i] = Math.round(col[i]);
        }
      }
    }

    if (status) this.__columnTotals();

    return status;
  }

  /**
   * Check correlation between two columns.  Returns the Pearson correlation between the numerical counts in the two
   * columns.  This may be used to determine if two columns are sufficiently dependent (highly correlated) to consider
   * removing one from Bayesian analysis.  Zero is returned if either column name is invalid.
   *
   * @param {string} column1 First column name
   *
   * @param {string} column2 Second column name
   */
  public columnCorrelation(column1Label: string, column2Label: string): number
  {
    const col1: number = this._colLabels.indexOf(column1Label);
    const col2: number = this._colLabels.indexOf(column2Label);

    if (col1 === -1 || col2 === -1) return 0.0;

    return this.__stats.correlation(this._table[col1], this._table[col2]);
  }

  // internal method - update column totals
  private __columnTotals(): void
  {
    const n: number    = this._colLabels.length;
    const rows: number = this._rowLabels.length;

    let i: number;
    let j: number;
    let col: Array<number>;
    let sum: number;

    for (j = 0; j < n; ++j)
    {
      col = this._table[j];
      sum = col[0];

      for (i = 1; i < rows; ++i) {
        sum += col[i];
      }

      this._colTotals[j] = sum;
    }

    this._invalidated = false;
  }

  // internal method - clear the current table and prepare for new input (setting the data provider auto-clears the table)
  private __clear(): void
  {
    this._table.length     = 0;
    this._rowLabels.length = 0;
    this._colLabels.length = 0;
    this._rowTotals.length = 0;
    this._colTotals.length = 0;

    this._invalidated    = true;
    this._sumInvalidated = true;
  }
}
