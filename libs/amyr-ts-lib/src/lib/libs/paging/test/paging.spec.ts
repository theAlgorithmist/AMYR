/** Copyright 2016 Jim Armstrong (www.algorithmist.net)
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

// Specs for validator functions and classes
import {PagingCalculator} from '../paging-calculator';

// Test Suites
describe('Paging', () => {

  it('has zero page size and from/to indices on construction', function() {
    const paging: PagingCalculator = new PagingCalculator();

    expect(paging.pageCount).toBe(0);
    expect(paging.from).toBe(0);
    expect(paging.to).toBe(0);
    expect(paging.currentPage).toBe(0);
    expect(paging.itemCount).toBe(0);
  });

  it('returns empty array on attempt to page with no data provider', function() {
    const paging: PagingCalculator = new PagingCalculator();

    expect(paging.next.length).toBe(0);
    expect(paging.previous.length).toBe(0);
  });


  it('does not allow a null or zero-length data provider', function() {
    const tmp: any = null;

    const paging: PagingCalculator = new PagingCalculator();
    paging.dataProvider            = tmp;

    expect(paging.itemCount).toBe(0);

    paging.dataProvider = [];
    expect(paging.itemCount).toBe(0);
    expect(paging.currentPage).toBe(0);
  });

  it('properly updates length and pageCount on proper setting of provider', function() {
    const paging: PagingCalculator = new PagingCalculator();
    paging.dataProvider      = [{}, {}, {}, {}, {}];

    expect(paging.itemCount).toBe(5);
    expect(paging.pageCount).toBe(0);

    paging.pageSize = 2;
    expect(paging.pageCount).toBe(3);
    expect(paging.remainder).toBe(1);
  });

  it('properly computes page remainder', function() {
    const paging: PagingCalculator = new PagingCalculator();
    paging.dataProvider      = [{}, {}, {}, {}];

    expect(paging.itemCount).toBe(4);
    expect(paging.pageCount).toBe(0);

    paging.pageSize = 2;
    expect(paging.pageCount).toBe(2);
    expect(paging.remainder).toBe(0);

    paging.dataProvider = [{}, {}, {}, {}, {}, {}, {}];
    paging.pageSize     = 3;
    expect(paging.remainder).toBe(1);

    paging.dataProvider = [{}];
    paging.pageSize     = 1;
    expect(paging.remainder).toBe(0);
  });

  it('will not paginate if pageSize exceeds item count', function() {
    const paging: PagingCalculator = new PagingCalculator();
    paging.dataProvider      = [{}, {}, {}];

    expect(paging.itemCount).toBe(3);
    expect(paging.pageCount).toBe(0);
    expect(paging.from).toBe(0);
    expect(paging.to).toBe(0);

    // simulate resetting page size but forgetting to also change data provider
    paging.pageSize = 4;
    expect(paging.next.length).toBe(0);
  });

  it('robustly accepts page size parameter', function() {
    const paging: PagingCalculator = new PagingCalculator();
    paging.dataProvider            = [{}, {}];

    paging.pageSize = 1.5;
    expect(paging.pageCount).toBe(1);
    expect(paging.remainder).toBe(0);

    paging.pageSize = NaN;
    expect(paging.pageCount).toBe(1);
    expect(paging.remainder).toBe(0);

    paging.pageSize = -1;
    expect(paging.pageCount).toBe(2);
    expect(paging.remainder).toBe(0);

    paging.dataProvider = [{}, {}, {}];
    expect(paging.pageCount).toBe(3);
    expect(paging.remainder).toBe(0);

    paging.pageSize = 2.04326;
    expect(paging.pageCount).toBe(2);
    expect(paging.remainder).toBe(1);

    paging.pageSize = 0;
    expect(paging.pageCount).toBe(3);
    expect(paging.remainder).toBe(0);

    paging.pageSize = 2;
    expect(paging.pageCount).toBe(2);
    expect(paging.remainder).toBe(1);
  });

  it('properly paginates data provider #1', function() {
    const paging: PagingCalculator = new PagingCalculator();
    paging.dataProvider            = [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}, {id: 6}, {id: 7}, {id: 8}, {id: 9}, {id: 10}, {id: 11}, {id: 12}, {id: 13}];

    expect(paging.itemCount).toBe(13);
    paging.pageSize = 4;

    expect(paging.pageCount).toBe(4);
    expect(paging.remainder).toBe(1);

    let page: Array<unknown> = paging.first;
    expect(page.length).toBe(4);

    let item: {[id: string]: number};

    item = page[0] as {[id: string]: number};
    expect(item['id']).toBe(1);

    item = page[3] as {[id: string]: number};
    expect(item['id']).toBe(4);

    page = paging.last;
    expect(page.length).toBe(4);

    item = page[0] as {[id: string]: number};
    expect(item['id']).toBe(10);

    item = page[3] as {[id: string]: number};
    expect(item['id']).toBe(13);

    // test singleton
    paging.dataProvider = [{id: 1}];

    expect(paging.itemCount).toBe(1);
    paging.pageSize = 1;

    expect(paging.pageCount).toBe(1);
    expect(paging.remainder).toBe(0);

    page = paging.first;
    expect(page.length).toBe(1);

    item = page[0] as {[id: string]: number};
    expect(item['id']).toBe(1);

    page = paging.last;
    expect(page.length).toBe(1);

    item = page[0] as {[id: string]: number};
    expect(item['id']).toBe(1);
  });

  it('properly paginates data provider #2', function() {
    const paging: PagingCalculator = new PagingCalculator();
    paging.dataProvider      = [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}, {id: 6}, {id: 7}, {id: 8}, {id: 9}, {id: 10}, {id: 11}, {id: 12}, {id: 13}, {id:14}];

    expect(paging.itemCount).toBe(14);
    paging.pageSize = 3;

    expect(paging.pageCount).toBe(5);
    expect(paging.remainder).toBe(2);
    expect(paging.currentPage).toBe(0);

    let page: Array<unknown> = paging.next();
    expect(page.length).toBe(3);

    let item: {[key: string]: number} = page[0] as {[key: string]: number};

    expect(item['id']).toBe(4);

    item = page[2] as {[key: string]: number};
    expect(item['id']).toBe(6);

    page = paging.next();
    expect(page.length).toBe(3);

    item = page[0] as {[key: string]: number};
    expect(item['id']).toBe(7);

    item = page[2] as {[key: string]: number};
    expect(item['id']).toBe(9);

    page = paging.next();
    expect(page.length).toBe(3);

    item = page[0] as {[key: string]: number};
    expect(item['id']).toBe(10);

    item = page[2] as {[key: string]: number};
    expect(item['id']).toBe(12);

    page = paging.next();
    expect(page.length).toBe(2);

    item = page[0] as {[key: string]: number};
    expect(item['id']).toBe(13);

    item = page[1] as {[key: string]: number};
    expect(item['id']).toBe(14);

    // try pushing beyond the end
    page = paging.next();
    expect(page.length).toBe(2);

    item = page[0] as {[key: string]: number};
    expect(item['id']).toBe(13);

    item = page[1] as {[key: string]: number};
    expect(item['id']).toBe(14);
    expect(paging.currentPage).toBe(4);

    // now, backwards ...
    page = paging.previous();
    expect(page.length).toBe(3);

    item = page[0] as {[key: string]: number};
    expect(item['id']).toBe(10);

    item = page[2] as {[key: string]: number};
    expect(item['id']).toBe(12);
    expect(paging.currentPage).toBe(3);

    page = paging.previous();
    expect(page.length).toBe(3);

    item = page[0] as {[key: string]: number};
    expect(item['id']).toBe(7);

    item = page[2] as {[key: string]: number};
    expect(item['id']).toBe(9);
    expect(paging.currentPage).toBe(2);

    page = paging.previous();
    expect(page.length).toBe(3);

    item = page[0] as {[key: string]: number};
    expect(item['id']).toBe(4);

    item = page[2] as {[key: string]: number};
    expect(item['id']).toBe(6);
    expect(paging.currentPage).toBe(1);

    page = paging.previous();
    expect(page.length).toBe(3);

    item = page[0] as {[key: string]: number};
    expect(item['id']).toBe(1);

    item = page[2] as {[key: string]: number};
    expect(item['id']).toBe(3);
    expect(paging.currentPage).toBe(0);

    // try pushing beyond bounds
    page = paging.previous();
    expect(page.length).toBe(3);

    item = page[0] as {[key: string]: number};
    expect(item['id']).toBe(1);

    item = page[2] as {[key: string]: number};
    expect(item['id']).toBe(3);
    expect(paging.currentPage).toBe(0);
  });

  it('allows data provider to be modified and auto-sets page propeties', function() {
    const paging: PagingCalculator = new PagingCalculator();
    paging.dataProvider      = [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}, {id: 6}, {id: 7}, {id: 8}, {id: 9}, {id: 10}, {id: 11}, {id: 12}, {id: 13}, {id:14}];

    expect(paging.itemCount).toBe(14);
    paging.pageSize = 3;

    expect(paging.pageCount).toBe(5);
    expect(paging.remainder).toBe(2);
    expect(paging.currentPage).toBe(0);

    const page: Array<unknown> = paging.next();
    expect(page.length).toBe(3);

    let item: {[key: string]: number} = page[0] as {[key: string]: number};
    expect(item['id']).toBe(4);

    item = page[2] as {[key: string]: number};
    expect(item['id']).toBe(6);
    expect(paging.currentPage).toBe(1);

    paging.dataProvider = [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}, {id: 6}, {id: 7}];
    expect(paging.itemCount).toBe(7);
    expect(paging.pageCount).toBe(3);
    expect(paging.remainder).toBe(1);
    expect(paging.currentPage).toBe(0);
  });

  it('properly extracts an arbitrary page', function() {
    const paging: PagingCalculator = new PagingCalculator();
    paging.dataProvider      = [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}, {id: 6}, {id: 7}, {id: 8}, {id: 9}, {id: 10}, {id: 11}, {id: 12}, {id: 13}];

    expect(paging.itemCount).toBe(13);
    paging.pageSize = 3;

    expect(paging.pageCount).toBe(5);
    expect(paging.remainder).toBe(1);

    let page: Array<unknown> = paging.getPage(3);
    expect(page.length).toBe(3);

    let item: {[key: string]: number} = page[0] as {[key: string]: number};
    expect(item['id']).toBe(10);

    item = page[2] as {[key: string]: number};
    expect(item['id']).toBe(12);

    page = paging.getPage(0);
    expect(page.length).toBe(3);

    item = page[0] as {[key: string]: number};
    expect(item['id']).toBe(1);

    item = page[2] as {[key: string]: number};
    expect(item['id']).toBe(3);

    page = paging.getPage(4);
    expect(page.length).toBe(1);

    item = page[0] as {[key: string]: number};
    expect(item['id']).toBe(13);

    page = paging.getPage(-1);
    expect(page.length).toBe(0);

    page = paging.getPage(5);
    expect(page.length).toBe(0);

    page = paging.getPage(2);
    expect(page.length).toBe(3);

    item = page[0] as {[key: string]: number};
    expect(item['id']).toBe(7);

    item = page[2] as {[key: string]: number};
    expect(item['id']).toBe(9);

    page = paging.next();
    expect(page.length).toBe(3);

    item = page[0] as {[key: string]: number};
    expect(item['id']).toBe(10);

    item = page[2] as {[key: string]: number};
    expect(item['id']).toBe(12);
  });
});


