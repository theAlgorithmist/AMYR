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

// Specs for various alpha release of Typescript Math Toolkit priority queue
import { Prioritizable } from '../../../datastructures/prioritizable';
import {
  TSMT$PriorityQueue,
  SortType,
  PQUEUE_SORT_ENUM,
  PQUEUE_SORT_PRIORITY,
  PQUEUE_SORT_TIMESTAMP
} from '../../../datastructures/priority-queue';

class PItem 
{
  protected _name  = "name";
  protected _id    = 0;
  protected _value = 0;

  constructor()
  {
    // empty
  }

  public get name(): string
  {
    return this._name;
  }

  public get id(): number
  {
    return this._id;
  }

  public get value(): number
  {
    return this._value;
  }

  // to be overriden if needed
  public computeValue(someData: object): void
  {
    // empty
  }
}

// Test Suites
describe('TSMT Priority Queue', () => {
  const __pobject: Prioritizable<object>     = new Prioritizable<object>(Object);
  const __pqueue: TSMT$PriorityQueue<object> = new TSMT$PriorityQueue<object>();

  it('constructs prioritizable object and queue properly', function() {
    expect(__pobject !== null).toBe(true);
    expect(__pqueue !== null).toBe(true);

    expect(__pobject.priority).toBe(0);
    expect(__pobject.timestamp).toBe(0);
  });

  it('prioritizable object accepts and returns data', function() {
    __pobject.data = {a:1, b:-1};
    const result: {a: number, b: number} = __pobject.data as {a: number, b: number};

    expect(result.a).toBe(1);
    expect(result.b).toBe(-1);
    expect(Object.keys(result).length).toBe(2);
  });

  it('prioritizable object works with class', function() {
    const item: Prioritizable<PItem> = new Prioritizable<PItem>(PItem);
    const pItem: PItem               = item.data as PItem;

    item.priority  = 1;
    item.timestamp = 1001;
 
    expect(item.priority).toBe(1);
    expect(item.timestamp).toBe(1001);
    expect(pItem.value).toBe(0);
  });

  it('prioritizable object works with no constructor argument', function() {
    const item: Prioritizable<PItem> = new Prioritizable<PItem>();
    const pItem: PItem               = new PItem();

    item.priority  = 1;
    item.timestamp = 1001;
    item.data      = pItem;

    const result: PItem = item.data;

    expect(item.priority).toBe(1);
    expect(item.timestamp).toBe(1001);
    expect(result.value).toBe(0);
  });

  it('returns zero for the length of a constructed, but uniinitialized priority queue', function() {
    expect(__pqueue.length).toBe(0);
  });

  it('accepts an array of prioritizable data as input', function() {
    const item1: Prioritizable<PItem> = new Prioritizable<PItem>();
    const pItem1: PItem               = new PItem();

    item1.priority  = 1;
    item1.timestamp = 1001;
    item1.data      = pItem1;

    const item2: Prioritizable<PItem> = new Prioritizable<PItem>();
    const pItem2: PItem               = new PItem();

    item2.priority  = 1;
    item2.timestamp = 1200;
    item2.data      = pItem2;

    const item3: Prioritizable<PItem> = new Prioritizable<PItem>();
    const pItem3: PItem               = new PItem();

    item3.priority  = 4;
    item3.timestamp = 1877;
    item3.data      = pItem3;

    const queue: TSMT$PriorityQueue<PItem> = new TSMT$PriorityQueue<PItem>();
    queue.data = [item1, item2, item3];

    expect(queue.length).toBe(3);
  });

  it('priority queue rejects invalid sort criteria', function() {
    const z: any = 'z';

    // note that this would cause a compile error
    // __pqueue.sortCriteria = ['p', 'z'];
    __pqueue.sortCriteria = ['p', z];

    const c: Array<SortType> = __pqueue.sortCriteria;
    expect(c.length).toBe(0);
  });

  it('adds individual items to the priority queue, while rejecing null additions', function() {
    const item1: Prioritizable<PItem> = new Prioritizable<PItem>();
    const pItem1: PItem               = new PItem();

    item1.priority  = 1;
    item1.timestamp = 1001;
    item1.data      = pItem1;

    const item2: Prioritizable<PItem> = new Prioritizable<PItem>();
    const pItem2: PItem               = new PItem();

    item2.priority  = 1;
    item2.timestamp = 1200;
    item2.data      = pItem2;

    const item3: Prioritizable<PItem> = new Prioritizable<PItem>();
    const pItem3: PItem               = new PItem();

    item3.priority  = 4;
    item3.timestamp = 1877;
    item3.data      = pItem3;

    const queue: TSMT$PriorityQueue<PItem> = new TSMT$PriorityQueue<PItem>();

    const badItem: any = null;

    queue.addItem(item1);
    queue.addItem(item2);
    queue.addItem(item3);
    queue.addItem(badItem);

    expect(queue.length).toBe(3);
  });

  it('properly maintains sorted order for queue of objects', function() {
    __pqueue.clear();

    const item1:  Prioritizable<object> = new Prioritizable<object>();
    const item2:  Prioritizable<object> = new Prioritizable<object>();
    const item3:  Prioritizable<object> = new Prioritizable<object>();
    const item4:  Prioritizable<object> = new Prioritizable<object>();
    const item5:  Prioritizable<object> = new Prioritizable<object>();
    const item6:  Prioritizable<object> = new Prioritizable<object>();
    const item7:  Prioritizable<object> = new Prioritizable<object>();
    const item8:  Prioritizable<object> = new Prioritizable<object>();
    const item9:  Prioritizable<object> = new Prioritizable<object>();
    const item10: Prioritizable<object> = new Prioritizable<object>();
    const item11: Prioritizable<object> = new Prioritizable<object>();
    const item12: Prioritizable<object> = new Prioritizable<object>();
    const item13: Prioritizable<object> = new Prioritizable<object>();

    item1.priority = 3;
    item1.data     = {value:100};

    item2.priority = 1;
    item2.data    = {value:50};

    item3.priority = 20;
    item3.data     = {value:0};

    item4.priority = 18;
    item4.data     = {value:1};

    item5.priority = 2;
    item5.data     = {value:75};

    item6.priority = 1;
    item6.data     = {value:75};

    item7.priority = 1;
    item7.data     = {value:100};

    item8.priority = 7;
    item8.data     = {value:30};

    item9.priority = 10;
    item9.data     = {value:35};

    item10.priority = 11;
    item10.data     = {value:35};

    item11.priority = 5;
    item11.data     = {value:100};

    item12.priority = 4;
    item12.data     = {value:75};

    item13.priority = 3;
    item13.data     = {value:50};

    // a complete sort is done by default on every addition.
    __pqueue.addItem(item1);
    __pqueue.addItem(item2);
    __pqueue.addItem(item3);
    __pqueue.addItem(item4);
    __pqueue.addItem(item5);
    __pqueue.addItem(item6);
    __pqueue.addItem(item7);
    __pqueue.addItem(item8);
    __pqueue.addItem(item9);
    __pqueue.addItem(item10);
    __pqueue.addItem(item11);
    __pqueue.addItem(item12);
    __pqueue.addItem(item13);

    expect(__pqueue.length).toBe(13);

    // the first three items in the queue should have priority 1
    let item:Prioritizable<object> = __pqueue.removeFirstItem();
    expect(item.priority).toBe(1);

    item = __pqueue.removeLastItem();
    expect(item.priority).toBe(20);
    expect(__pqueue.length).toBe(11);
  });

   it('properly maintains sorted order for both priority and timestamp', function() {
    __pqueue.clear();

    const item1:  Prioritizable<object> = new Prioritizable<object>();
    const item2:  Prioritizable<object> = new Prioritizable<object>();
    const item3:  Prioritizable<object> = new Prioritizable<object>();
    const item4:  Prioritizable<object> = new Prioritizable<object>();
    const item5:  Prioritizable<object> = new Prioritizable<object>();
    const item6:  Prioritizable<object> = new Prioritizable<object>();
    const item7:  Prioritizable<object> = new Prioritizable<object>();
    const item8:  Prioritizable<object> = new Prioritizable<object>();
    const item9:  Prioritizable<object> = new Prioritizable<object>();
    const item10: Prioritizable<object> = new Prioritizable<object>();
    const item11: Prioritizable<object> = new Prioritizable<object>();
    const item12: Prioritizable<object> = new Prioritizable<object>();
    const item13: Prioritizable<object> = new Prioritizable<object>();

    item1.priority  = 3;
    item1.timestamp = 1000;
    item1.data      = {value:100};

    item2.priority  = 1;
    item2.timestamp = 1010;
    item2.data      = {value:50};

    item3.priority  = 20;
    item3.timestamp = 1020;
    item3.data      = {value:0};

    item4.priority  = 18;
    item4.timestamp = 1030;
    item4.data      = {value:1};

    item5.priority  = 2;
    item5.timestamp = 1040;
    item5.data      = {value:75};

    item6.priority  = 1;
    item6.timestamp = 1050;
    item6.data      = {value:75};

    item7.priority  = 1;
    item7.timestamp = 1060;
    item7.data      = {value:100};

    item8.priority  = 7;
    item8.timestamp = 1070;
    item8.data      = {value:30};

    item9.priority  = 10;
    item9.timestamp = 1080;
    item9.data      = {value:35};

    item10.priority  = 11;
    item10.timestamp = 1090;
    item10.data      = {value:35};

    item11.priority  = 5;
    item11.timestamp = 1100;
    item11.data      = {value:100};

    item12.priority  = 4;
    item12.timestamp = 1110;
    item12.data      = {value:75};

    item13.priority  = 3;
    item13.timestamp = 1120;
    item13.data      = {value:50};

    // set the sort criteria - priority first (ties in priority broken by timestamp)
    __pqueue.sortCriteria = [PQUEUE_SORT_PRIORITY, PQUEUE_SORT_TIMESTAMP];

    // a complete sort is done by default on every addition.
    __pqueue.addItem(item1);
    __pqueue.addItem(item2);
    __pqueue.addItem(item3);
    __pqueue.addItem(item4);
    __pqueue.addItem(item5);
    __pqueue.addItem(item6);
    __pqueue.addItem(item7);
    __pqueue.addItem(item8);
    __pqueue.addItem(item9);
    __pqueue.addItem(item10);
    __pqueue.addItem(item11);
    __pqueue.addItem(item12);
    __pqueue.addItem(item13);

    expect(__pqueue.length).toBe(13);

    // the first three items in the queue should have priority 1
    let item:Prioritizable<object> = __pqueue.removeFirstItem();
    expect(item.priority).toBe(1);

    item = __pqueue.removeLastItem();
    expect(item.priority).toBe(20);
    expect(__pqueue.length).toBe(11);
  });
});
