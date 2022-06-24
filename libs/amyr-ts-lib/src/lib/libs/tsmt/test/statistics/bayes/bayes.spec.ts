/** Copyright 2018 Jim Armstrong (www.algorithmist.net)
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

// Specs for Typescript Math Toolkit Naive Bayes Library

// test functions/classes
import { FrequencyTable } from "../../../statistics/bayes/frequency-table";
import { Bayes          } from "../../../statistics/bayes/bayes";

// this will be re-used in Bayesian analysis - data is from 'Machine Learning in R' by Lantz
const spamTestTable : FrequencyTable = new FrequencyTable();

const data: Array<Array<number>> = new Array< Array<number> >();
const rows: Array<string>        = [ "Spam", "Not Spam" ];
const cols: Array<string>        = [ "Viagra Y", "Viagra N", "Money Y", "Money N", "Groceries Y", "Groceries N", "Unsubscribe Y", "Unsubscribe N" ];
const rowTotals: Array<number>   = [20, 80];

data.push( [4, 16, 10, 10, 0, 20, 12, 8] );
data.push( [1, 79, 14, 66, 8, 71, 23, 57] );

spamTestTable.fromArray( data, rows, cols, rowTotals );

let spamTestClone: FrequencyTable;

// Test Suites
describe('Frequency Table Tests: FrequencyTable', () =>
{
  it('properly constructs a new Frequency Table', () =>
  {
    const table: FrequencyTable = new FrequencyTable();

    expect(table.rowCount).toBe(0);
    expect(table.colCount).toBe(0);
    expect(table.rowTotals.length).toBe(0);
    expect(table.columnTotals.length).toBe(0);
    expect(table.rowLabels.length).toBe(0);
    expect(table.columnLabels.length).toBe(0)
  });

  it('maintains empty table on incorrect input', () =>
  {
    const table: FrequencyTable = new FrequencyTable();

    const rows: any = null;
    const cols: any = null;

    table.fromArray([], rows, cols, []);

    expect(table.rowCount).toBe(0);
    expect(table.colCount).toBe(0);
    expect(table.rowTotals.length).toBe(0);
    expect(table.columnTotals.length).toBe(0);
    expect(table.rowLabels.length).toBe(0);
    expect(table.columnLabels.length).toBe(0)
  });

  it('creates table from correctly formatted data', () =>
  {
    expect(spamTestTable.rowCount).toBe(2);
    expect(spamTestTable.colCount).toBe(8);

    const rowTotals: Array<number> = spamTestTable.rowTotals;
    const colTotals: Array<number> = spamTestTable.columnTotals;

    expect(rowTotals.length).toBe(2);
    expect(colTotals.length).toBe(8);
    expect(rowTotals[0]).toBe(20);
    expect(rowTotals[1]).toBe(80);

    expect(colTotals[0]).toBe(5);
    expect(colTotals[1]).toBe(95);
    expect(colTotals[2]).toBe(24);
    expect(colTotals[3]).toBe(76);
    expect(colTotals[4]).toBe(8);
    expect(colTotals[5]).toBe(91);
    expect(colTotals[6]).toBe(35);
    expect(colTotals[7]).toBe(65);
  });

  it('properly extracts column data by name', () =>
  {
    const column: Array<number> = spamTestTable.getColumn('Groceries Y');

    expect(column[0]).toBe(0);
    expect(column[1]).toBe(8);
  });

  it('properly clones a frequency table', () =>
  {
    spamTestClone = spamTestTable.clone();

    expect(spamTestClone.rowCount).toBe(2);
    expect(spamTestClone.colCount).toBe(8);

    const rowTotals: Array<number> = spamTestClone.rowTotals;
    const colTotals: Array<number> = spamTestClone.columnTotals;

    expect(rowTotals.length).toBe(2);
    expect(colTotals.length).toBe(8);
    expect(rowTotals[0]).toBe(20);
    expect(rowTotals[1]).toBe(80);

    expect(colTotals[0]).toBe(5);
    expect(colTotals[1]).toBe(95);
    expect(colTotals[2]).toBe(24);
    expect(colTotals[3]).toBe(76);
    expect(colTotals[4]).toBe(8);
    expect(colTotals[5]).toBe(91);
    expect(colTotals[6]).toBe(35);
    expect(colTotals[7]).toBe(65);
  });

  it('properly creates a frequency table by adding individual cell frequencies', () =>
  {
    const table: FrequencyTable = new FrequencyTable();

    table.setupTable(rows, cols);

    // add data to the table one cell at a time, like an interactive experiment
    table.addCellFrequency( "Spam", "Viagra Y"      , 4  );
    table.addCellFrequency( "Spam", "Viagra N"      , 16 );
    table.addCellFrequency( "Spam", "Money Y"       , 10 );
    table.addCellFrequency( "Spam", "Money N"       , 10 );
    table.addCellFrequency( "Spam", "Groceries N"   , 0  );
    table.addCellFrequency( "Spam", "Unsubscribe Y" , 12 );
    table.addCellFrequency( "Spam", "Unsubscribe N" , 8  );

    table.addCellFrequency( "Not Spam", "Viagra Y"      , 1  );
    table.addCellFrequency( "Not Spam", "Viagra N"      , 79 );
    table.addCellFrequency( "Not Spam", "Money Y"       , 14 );
    table.addCellFrequency( "Not Spam", "Money N"       , 66 );
    table.addCellFrequency( "Not Spam", "Groceries Y"   , 8  );
    table.addCellFrequency( "Not Spam", "Groceries N"   , 71 );
    table.addCellFrequency( "Not Spam", "Unsubscribe Y" , 23 );
    table.addCellFrequency( "Not Spam", "Unsubscribe N" , 57 );

    table.addRowCount( "Spam"    , 20 );
    table.addRowCount( "Not Spam", 80 );

    const rowTotals: Array<number> = spamTestClone.rowTotals;
    const colTotals: Array<number> = spamTestClone.columnTotals;

    expect(rowTotals.length).toBe(2);
    expect(colTotals.length).toBe(8);
    expect(rowTotals[0]).toBe(20);
    expect(rowTotals[1]).toBe(80);

    expect(colTotals[0]).toBe(5);
    expect(colTotals[1]).toBe(95);
    expect(colTotals[2]).toBe(24);
    expect(colTotals[3]).toBe(76);
    expect(colTotals[4]).toBe(8);
    expect(colTotals[5]).toBe(91);
    expect(colTotals[6]).toBe(35);
    expect(colTotals[7]).toBe(65);
  });

  it('applies proper table validation', () =>
  {
    const table: FrequencyTable = new FrequencyTable();

    let rows: any = undefined;
    let cols: any = undefined;
    let validate: boolean;

    table.fromArray([], rows, cols, []);

    validate = table.validate();

    expect(validate).toBe(false);

    rows = ['row1', 'row2', 'row3'];
    cols = ['col1'];

    table.setupTable(rows, cols);
    validate = table.validate();
    expect(validate).toBe(false);  // singleton column

    cols = ['col1', 'col2'];
    table.setupTable(rows, cols);

    validate = table.validate();
    expect(validate).toBe(false);  // no row totals

    table.addRowCount('row1', 10);
    table.addRowCount('row2', 20);
    table.addRowCount('row3', 30);

    table.addCellFrequency('row1', 'col1', NaN);
    validate = table.validate();
    expect(validate).toBe(false);  // bad cell data

    rows = ['row1', 'row2'];
    cols = ['col1', 'col2'];

    table.setupTable(rows, cols);
    table.addRowCount('row1', 10);
    table.addRowCount('row2', 20);

    // this will be converted to +1
    table.addCellFrequency('row1', 'col1', -1);

    validate = table.validate();
    expect(validate).toBe(true);

    table.addCellFrequency('row1', 'col1', 20);
    validate = table.validate();
    expect(validate).toBe(false);  // cell frequency exceeds row count

    table.setupTable(rows, cols);
    table.addRowCount('row1', 10);
    table.addRowCount('row2', 20);

    table.addCellFrequency('row1', 'col1', 1);
    table.addCellFrequency('row1', 'col2', 3);
    table.addCellFrequency('row2', 'col1', 4);
    table.addCellFrequency('row2', 'col2', 2);

    validate = table.validate();
    expect(validate).toBe(true);  // finally! a good one !
  });

  it('column correlation returns zero for incorrect column name', () =>
  {
    const table: FrequencyTable = new FrequencyTable();

    const rows: Array<string> = ['row1', 'row2'];
    const cols: Array<string> = ['col1', 'col2'];

    table.setupTable(rows, cols);
    table.addRowCount('row1', 10);
    table.addRowCount('row2', 20);

    const corr: number = table.columnCorrelation('col', 'col2');
    expect(corr).toBe(0);
  });

  it('computes correct column correlation', () =>
  {
    const table: FrequencyTable = new FrequencyTable();

    const rows: Array<string> = ['row1', 'row2', 'row3', 'row4', 'row5', 'row6', 'row7'];
    const cols: Array<string> = ['col1', 'col2'];

    table.setupTable(rows, cols);
    table.addCellFrequency('row1', 'col1', 43);
    table.addCellFrequency('row2', 'col1', 21);
    table.addCellFrequency('row3', 'col1', 25);
    table.addCellFrequency('row4', 'col1', 42);
    table.addCellFrequency('row5', 'col1', 57);
    table.addCellFrequency('row6', 'col1', 59);
    table.addCellFrequency('row7', 'col1', 247);

    table.addCellFrequency('row1', 'col2', 99);
    table.addCellFrequency('row2', 'col2', 65);
    table.addCellFrequency('row3', 'col2', 79);
    table.addCellFrequency('row4', 'col2', 75);
    table.addCellFrequency('row5', 'col2', 87);
    table.addCellFrequency('row6', 'col2', 81);
    table.addCellFrequency('row7', 'col2', 486);

    table.addRowCount('row1', 1000);
    table.addRowCount('row2', 2000);

    const corr: number = table.columnCorrelation('col1', 'col2');
    expect(Math.abs(corr - 0.98761) < 0.0001).toBe(true);
  });

  it('table accessor preserves immutability of internal data', () =>
  {
    const table: FrequencyTable = new FrequencyTable();

    const rows: Array<string> = ['row1', 'row2', 'row3', 'row4', 'row5', 'row6', 'row7'];
    const cols: Array<string> = ['col1', 'col2'];

    const col1Data: Array<number> = [43, 21, 25, 42, 57, 59, 247];
    const col2Data: Array<number> = [99, 65, 79, 75, 87, 81, 486];

    table.setupTable(rows, cols);
    table.addCellFrequency('row1', 'col1', col1Data[0]);
    table.addCellFrequency('row2', 'col1', col1Data[1]);
    table.addCellFrequency('row3', 'col1', col1Data[2]);
    table.addCellFrequency('row4', 'col1', col1Data[3]);
    table.addCellFrequency('row5', 'col1', col1Data[4]);
    table.addCellFrequency('row6', 'col1', col1Data[5]);
    table.addCellFrequency('row7', 'col1', col1Data[6]);

    table.addCellFrequency('row1', 'col2', col2Data[0]);
    table.addCellFrequency('row2', 'col2', col2Data[1]);
    table.addCellFrequency('row3', 'col2', col2Data[2]);
    table.addCellFrequency('row4', 'col2', col2Data[3]);
    table.addCellFrequency('row5', 'col2', col2Data[4]);
    table.addCellFrequency('row6', 'col2', col2Data[5]);
    table.addCellFrequency('row7', 'col2', col2Data[6]);

    table.addRowCount('row1', 1000);
    table.addRowCount('row2', 2000);

    const tableData: Array< Array<number> > = table.table;

    // now, mutate one of the data array values
    col1Data[0] = -1;

    // if it's a clean copy, then returned table data will be unchanged
    expect(tableData[0][0]).toBe(43);

    // even more medieval
    col1Data.length = 0;
    col2Data.length = 0;

    expect(tableData[0].length).toBe(7);
    expect(tableData[1].length).toBe(7);
  });
});

describe('Naive Bayes: Bayes', () =>
{
  it('properly constructs a new Bayes instance', () =>
  {
    const bayes: Bayes = new Bayes();

    expect(bayes).toBeTruthy();
  });

  it('properly handles edge cases', () =>
  {
    const bayes: Bayes = new Bayes();
    let result: number = bayes.naive('', []);

    expect(result).toBe(-1);

    const table: FrequencyTable = new FrequencyTable();

    bayes.table = table;
    result      = bayes.naive('', []);

    expect(result).toBe(-1);
  });

  it('works properly with a singleton predictor', () =>
  {
    const bayes: Bayes          = new Bayes();
    const table: FrequencyTable = new FrequencyTable();

    const rows: Array<string>      = [ "Golf Y", "Golf N" ];
    const cols: Array<string>      = [ "Sunny", "Overcast", "Rainy" ];
    const rowTotals: Array<number> = [ 9, 5 ];

    const data: Array< Array<number> > = [];

    // data is entered row-wise
    data.push( [3, 4, 2] );
    data.push( [2, 0, 3] );

    table.fromArray( data, rows, cols, rowTotals );

    // bayes works off a frequency table
    bayes.table = table;

    // probability of playing golf given it is a sunny day
    const result: number = bayes.naive( "Golf Y", ["Sunny"] );

    expect(Math.abs(result - 0.6) < 0.001).toBe(true);
  });

  it('works properly with multiple predictors #1', () =>
  {
    const bayes: Bayes          = new Bayes();
    const table: FrequencyTable = new FrequencyTable();

    const rows: Array<string>      = [ "Banana", "Orange", "Other" ];
    const cols: Array<string>      = [ "Long", "Sweet", "Yellow" ];
    const rowTotals: Array<number> = [ 500, 300, 200 ];

    const data: Array< Array<number> > = [];

    // data is entered row-wise
    data.push( [400, 350, 450] );
    data.push( [0  , 150, 300] );
    data.push( [100, 150, 50 ] );

    table.fromArray( data, rows, cols, rowTotals );

    // bayes works off a frequency table
    bayes.table = table;

    // probability a fruit is a banana given that it is long, sweet, and yellow (numerator only)
    let result: number = bayes.naive( "Banana", ["Long", "Sweet", "Yellow"], true );

    expect(Math.abs(result - 0.252) < 0.001).toBe(true);

    // probability fruit is 'other' given long, sweet, and yellow (numerator only)
    result = bayes.naive( "Other", ["Long", "Sweet", "Yellow"], true );
    expect(Math.abs(result - 0.01875) < 0.001).toBe(true);
  });

  it('works properly with multiple predictors #2', () =>
  {
    const bayes: Bayes          = new Bayes();
    const table: FrequencyTable = new FrequencyTable();

    const rows: Array<string>      = [ "Parrot", "Dog", "Fish" ];
    const cols: Array<string>      = [ "Swim", "Wings", "Green", "Teeth" ];
    const rowTotals: Array<number> = [ 500, 500, 500 ];

    const data: Array< Array<number> > = [];

    // data is entered row-wise
    data.push( [50 , 500, 400, 0  ] );
    data.push( [450, 0  , 0  , 500] );
    data.push( [500, 0  , 100, 50 ] );

    table.fromArray( data, rows, cols, rowTotals );

    // bayes works off a frequency table
    bayes.table = table;

    // probability an animal is a dog given that it swims and is green (use raw data)
    let result: number = bayes.naive( "Dog", ["Swim", "Green"] );
    expect(result).toBe(0);

    // probability an animal is a parrot given that it swims and is green
    result = bayes.naive( "Parrot", ["Swim", "Green"] );
    expect(Math.abs(result - 0.12) < 0.01).toBe(true);

    // probability an animal is a fish given that it swims and is green
    result = bayes.naive( "Fish", ["Swim", "Green"] );
    expect(Math.abs(result - 0.3) < 0.01).toBe(true);

    // now, use three predictors

    // probability an animal is a dog given that it swims, is green, and has nasty teeth
    result = bayes.naive( "Dog", ["Swim", "Green", "Teeth"] );
    expect(result).toBe(0);

    // probability an animal is a parrot given that it swims, is green, and has nasty teeth
    result = bayes.naive( "Parrot", ["Swim", "Green", "Teeth"] );
    expect(result).toBe(0);

    // probability an animal is a fish given that it swims, is green, and has nasty teeth
    result = bayes.naive( "Fish", ["Swim", "Green", "Teeth"] );
    expect(Math.abs(result - 0.0818) < 0.001).toBe(true);
  });

  it('works properly with multiple predictors #3', () => {
    // analysis is from 'Machine Learning in R' by Lantz
    const bayes: Bayes = new Bayes();

    // set the frequency table
    bayes.table = spamTestTable;

    // probability of spam given 'Viagra Y', 'Money N', 'Groceries N', and 'Unsubscribe Y', i.e. a message contains the
    // words 'Viagra' and 'Unsubscribe' - numerator only
    const pSpam: number = bayes.naive('Spam', ['Viagra Y', 'Money N', 'Groceries N', 'Unsubscribe Y'], true);
    expect(pSpam).toBe(0.012);

    // probability of not spam given the same word set
    const pNotSpam: number = bayes.naive('Not Spam', ['Viagra Y', 'Money N', 'Groceries N', 'Unsubscribe Y'], true);
    expect(Math.abs(pNotSpam - 0.0021) < 0.001).toBe(true);

    // total likelihood of spam or not spam
    const total: number = pSpam + pNotSpam;

    // probability of spam
    const probSpam: number = pSpam/total;

    // probability of not spam
    const probNotSpam: number = pNotSpam/total;

    expect(Math.abs(probSpam - 0.85076) < 0.0001).toBe(true);
    expect(Math.abs(probNotSpam - 0.14924) < 0.0001).toBe(true);
  });
});
